/**
 * @author wxh
 * @time 2015-04-8
 * @action 通过id获取DOM结构
 * @arguments id:元素id
 * @version 1.0
 */
function obj(id) {
	return typeof id == 'string' ? document.getElementById(id) : id
}

/**
 * @author wxh
 * @time 2015-04-16
 * @action 事件绑定
 * @arguments o:元素id,func:函数名,tag:事件类型
 * @version 1.0
 */
function objAddListener(o, func, tag) {
	if (o) {
		if (tag)
			o.addEventListener(tag, func);
		else
			o.addEventListener('tap', func);
	}
};
/**
 * 获取通谱服务器完整的路径
 * @author 魏寿明
 * @time 2015年3月25日
 * @version 1.0
 */

function CompletePersonalServerURL(url) {
	if (localStorage.turl == null) {
		/*测试服务器地址*/
		//localStorage.turl = 'http://test.user.jp5000.com/';
		/*正式服务器地址*/
		localStorage.turl = 'http://www.jp5000.cc/';
		return localStorage.turl + url;
	} else {
		return localStorage.turl + url;
	}
};
/**
 * 获取网络图片的完整的路径
 * @author 魏寿明
 * @time 2015年3月25日
 * @version 1.0
 */
function CompleteWebURL(url) {
	return localStorage.staticServerPath + url;
};
/**
 * 获取uuId
 * @author 魏寿明
 * @time 2015年3月25日
 * @version 1.0
 */
function getLoginId() {
	return localStorage.logid;
};
/**
 * 下载图片
 * @author 魏寿明
 * @time 2015年3月25日
 * @version 1.0
 */
function downloadImg(path, i) {
	var ipath;
	var dtask;
	mui.plusReady(function() {
		var mfilename;
		var md = new Date();
		mfilename = md.getTime() + ".jpeg";
		var murl;
		murl = CompleteWebURL(path);
		dtask = plus.downloader.createDownload(murl, {
			filename: mfilename
		}, function(d, status) {
			// 下载完成
			if (status == 200) {
				plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
					// 可通过entry对象操作test.html文件 
					//						mimg.src = entry.toLocalURL();
					var mid = "mimg" + i;
					setTimeout(function() {
						obj(mid).src = entry.toLocalURL();
					}, 200);
					localStorage.setItem("fpath" + i, entry.toLocalURL());
				}, function(e) {
					mui.toast("Resolve file URL failed: " + e.message);
				});
			} else {
				mui.toast("Download failed: " + status);
			}
		});
		//dtask.addEventListener( "statechanged", onStateChanged, false );
		dtask.start();
	})
};
/**
 * 避免重复打开页面
 * @author 魏寿明
 * @time 2015年3月25日
 * @version 1.0
 */
(function(w) {
	//	// 空函数
	//	function shield() {
	//		return false;
	//	}
	//	document.addEventListener('touchstart', shield, false); //取消浏览器的所有事件，使得active的样式在手机上正常生效
	//	document.oncontextmenu = shield; //屏蔽选择函数/**/
	// H5 plus事件处理
	var ws = null,
		as = 'slide-in-right',
		at = 200;

	function plusReady() {
		ws = plus.webview.currentWebview();
		compatibleAdjust();
	}
	if (w.plus) {
		plusReady();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
	// 处理点击事件
	var openw = null,
		waiting = null;
	/**
	 * 打开新窗口
	 * @param {URIString} id : 要打开页面url
	 * @param {boolean} wa : 是否显示等待框
	 * @param {boolean} ns : 是否不自动显示
	 */
	w.clicked = function(id, wa, ns) {
		if (openw) { //避免多次打开同一个页面
			return null;
		}
		if (w.plus) {
			wa && (waiting = plus.nativeUI.showWaiting());
			var pre = ''; //'http://192.168.1.178:8080/h5/';
			openw = plus.webview.create(pre + id, id, {
				scrollIndicator: 'none',
				scalable: false
			});
			ns || openw.addEventListener('loaded', function() { //页面加载完成后才显示
				//		setTimeout(function(){//延后显示可避免低端机上动画时白屏
				closeWaiting();
				openw.show(as, at);
				//		},200);
			}, false);
			openw.addEventListener('close', function() { //页面关闭后可再次打开
				openw = null;
			}, false);
			return openw;
		} else {
			w.open(id);
		}
		return null;
	};
	/**
	 * 关闭等待框
	 */
	w.closeWaiting = function() {
			waiting && waiting.close();
			waiting = null;
		}
		// 兼容性样式调整
	var adjust = false;

	function compatibleAdjust() {
		if (adjust || !w.plus) {
			return;
		} // iOS平台使用滚动的div
		if ('iOS' == plus.os.name) {
			as = 'pop-in';
			at = 300;
			var t = document.getElementById("dcontent");
			t && (t.className = "sdcontent");
			t = document.getElementById("content");
			t && (t.className = "scontent");
			//iOS8横竖屏切换div不更新滚动问题
			var lasto = window.orientation;
			window.addEventListener("orientationchange", function() {
				var nowo = window.orientation;
				if (lasto != nowo && (90 == nowo || -90 == nowo)) {
					dcontent && (0 == dcontent.scrollTop) && (dcontent.scrollTop = 1);
					content && (0 == content.scrollTop) && (content.scrollTop = 1);
				}
				lasto = nowo;
			}, false);
		}
		adjust = true;
	};
	w.compatibleConfirm = function() {
		plus.nativeUI.confirm('本OS原生层面不提供该控件，需使用mui框架实现类似效果。请点击“确定”下载Hello mui示例', function(e) {
			if (0 == e.index) {
				plus.runtime.openURL("http://www.dcloud.io/hellomui/");
			}
		}, "", ["确定", "取消"]);
	}
})(window);
/**
 * 通过图片路径获取图片真实大小，并进行压缩
 * @author 魏寿明
 * @time 2015年5月7日
 * @version 1.0
 */
function getRealSize(path, callback) {
	var img = new Image();
	var tempimg = new Image();
	img.src = path.toLocalURL();
	img.onload = function() {
		var height = img.naturalHeight;
		var width = img.naturalWidth;
		img.width = img.naturalWidth;
		img.height = img.naturalHeight;
		//压缩图片
		var canvas = compressImage(img);
		tempimg = canvas.toDataURL('image/jpeg');
		callback(tempimg);
	}
};
/**
 * 通过图片本地路径获取图片真实大小，并进行压缩
 * @author 魏寿明
 * @time 2015年5月7日
 * @version 1.0
 */
function getLocalRealSize(path, callback) {
	var img = new Image();
	var tempimg = new Image();
	img.src = path;
	img.onload = function() {
		var height = img.naturalHeight;
		var width = img.naturalWidth;
		img.width = img.naturalWidth;
		img.height = img.naturalHeight;
		//压缩图片
		var canvas = compressImage(img);
		tempimg = canvas.toDataURL('image/jpeg');
		callback(tempimg);
	}
};

/**
 * 压缩图片
 * @author 魏寿明
 * @time 2015年3月25日
 * @version 1.0
 */
function compressImage(image) {
		var canvas = document.createElement("canvas");
		var mwidth = image.width;
		var mheight = image.height;
		var scale = 1;
		var i = 0;
		while (true) {
			if (mwidth >> i <= 1000 && mheight >> i <= 1000) {
				scale = Math.pow(0.5, i);
				break;
			}
			i += 1;

		}
		canvas.width = mwidth * scale;
		canvas.height = mheight * scale;
		canvas.getContext("2d").drawImage(image, 0, 0, mwidth * scale, mheight * scale);
		return canvas;
	}
	/**
	 * 生成uuid
	 * @author 魏寿明
	 * @time 2015年5月6日
	 * @version 1.0
	 */
	(function() {
		// Private array of chars to use
		var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		Math.uuid = function(len, radix) {
			var chars = CHARS,
				uuid = [],
				i;
			radix = radix || chars.length;

			if (len) {
				// Compact form
				for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
			} else {
				// rfc4122, version 4 form
				var r;

				// rfc4122 requires these characters
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				uuid[14] = '4';

				// Fill in random data.  At i==19 set the high bits of clock sequence as
				// per rfc4122, sec. 4.1.5
				for (i = 0; i < 36; i++) {
					if (!uuid[i]) {
						r = 0 | Math.random() * 16;
						uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
					}
				}
			}

			return uuid.join('');
		};
	})();
/**
 * 毫秒转换成年月日
 * @author 魏寿明
 * @time 2015年3月25日
 * @version 1.0
 */
function timeToYMD(time) {
	time = new Date(time);
	time = time.getFullYear() + "年" + (time.getMonth() + 1) + "月" + time.getDate() + "日";
	return time;
};
/**
 * 毫秒转换成后台格式年-月-日
 * @author 魏寿明
 * @time 2015年3月25日
 * @version 1.0
 */
function timeToFormatYMD(time) {
	time = new Date(time);
	time = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
	return time;
};
/**
 * 将时间处理为 xx分钟前
 * @author 魏寿明
 * @time 2015年3月25日
 * @version 1.0
 */
function dataToBefore(mdate) {
	var nDate = new Date();
	var difference = nDate.getTime() - mdate;
	var seconds = 1000;
	var minutes = seconds * 60;
	var hours = minutes * 60;
	var days = hours * 24;
	var months = days * 30;
	var years = days * 365;
	var elapsedTime = difference;
	if (elapsedTime < minutes) {
		return parseInt(elapsedTime / seconds) + "秒前";
	} else if (elapsedTime >= minutes && elapsedTime < hours) {
		return parseInt(elapsedTime / minutes) + "分钟前";
	} else if (elapsedTime >= hours && elapsedTime < days) {
		return parseInt(elapsedTime / hours) + "小时前";
	} else if (elapsedTime >= days && elapsedTime < months) {
		return parseInt(elapsedTime / days) + "天前";
	} else if (elapsedTime >= months && elapsedTime < years) {
		return parseInt(elapsedTime / months) + "月前";
	} else if (elapsedTime >= years) {
		return parseInt(elapsedTime / days) + "年前";
	}
};
//初始化数据
var Init = Init || {};
Init._openw = null;
Init.openw = null;
Init.waiting = null;
Init.ws = null;
Init.as = 'slide-in-right';
Init.at = 200;
/**
 * 监听打开新页面是否处理
 * @author 魏寿明
 * @time 2015年3月25日
 * @version 1.0
 */
function pclicked(id, wa, ns) {
	if (Init._openw) {
		return
	} else {
		mui.plusReady(function() {
			var pre = "";
			wa && (Init.waiting = plus.nativeUI.showWaiting());
			Init._openw = plus.webview.create(pre + id, id, {
				scrollIndicator: 'none',
				scalable: false
			});
			ns || Init._openw.addEventListener('loaded', function() {
				Init.waiting.close();
				Init._openw.show(Init.as, Init.at);
			});
			var ws = plus.webview.currentWebview();
			Init._openw.addEventListener('close', function() {
				Init._openw = null;
				if (localStorage.closeflag == 1) {
					ws.reload();
					localStorage.closeflag = 0;
				}
			});
		})
	}
};