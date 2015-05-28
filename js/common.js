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