var events = (function(mod) {
	/**
	 * 在本地储存数组中 添加 或删除 value
	 * @param {Object} key 键值
	 * @param {Object} value 要存储或删除的值
	 * @param {Object} isAdd 0删除 1添加
	 */
	mod.toggleValueInSessionArray = function(key, value, isAdd) {
		var arr = mod.getSessionArray(key);
		console.log("获取的本地的值：" + JSON.stringify(arr));
		sessionStorage.setItem(key, JSON.stringify(mod.toggleValueInArray(arr, value, isAdd)));
	}
	mod.setSessionArray = function(key, arr) {
		sessionStorage.setItem(key, JSON.stringify(arr));
	}

	//短信群发
	mod.SendSmsForMobiles = function(mobiles,content) {
		console.log('mobiles:'+mobiles);
		console.log('content:'+content);
		var personal = store.get(window.storageKeyName.PERSONALINFO);
		var publicParameter = store.get(window.storageKeyName.PUBLICPARAMETER);
		var enData0 = {};
		//不需要加密的数据
		var comData0 = {
			uuid: publicParameter.uuid, //用户设备号
			utoken: personal.utoken, //用户令牌
			content: content, //发送的内容,不超过300汉字
			mobiles: mobiles //手机号码组,多个用逗号隔开
		}
		//发送网络请求，data为网络返回值
		postDataEncry('SendSms', enData0, comData0, 0, function(data) {
			
		});
	}

	/**
	 * 数组中删除或添加值
	 * @param {Object} arr 数组
	 * @param {Object} value 要添加或删除的值
	 * @param {Object} isAdd 0删除 1添加
	 */
	mod.toggleValueInArray = function(arr, value, isAdd) {
		console.log("是否添加数据？" + isAdd + ",要处理的值:" + value);
		var arrs = mod.isExistInArray(arr, value);
		if(isAdd) {
			if(arrs[1] < 0) {
				arrs[0].push(value);
			}
		} else {
			if(arrs[1] >= 0) {
				arrs[0].splice(arrs[1], 1);
			}
		}
		console.log("加载或删除后的数组：" + JSON.stringify(arrs[0]));
		return arrs[0];
	}
	/**
	 * 获取存储在本地的localStorage
	 * @param {Object} key 数组对应的key值
	 */
	mod.getSessionArray = function(key) {
		var arr;
		if(sessionStorage.getItem(key)) {
			arr = JSON.parse(sessionStorage.getItem(key));
		} else {
			arr = [];
		}
		console.log("获取的本地存储数组：" + JSON.stringify(arr));
		return arr;
	}
	mod.isExistInSessionArray = function(key, value) {
		var arr = mod.getSessionArray(key);
		return mod.isExistInArray(arr, value);
	}
	mod.isExistInArray = function(arr, value) {
		var arrs = [arr, arr.indexOf(value)];
		console.log("获取的是否值是否存在于数组中：" + JSON.stringify(arrs));
		return arrs;
	}
	mod.getSessionMap = function(key) {
		console.log("****getSessionMap***获取的本地值:" + sessionStorage.getItem(key));
		if(sessionStorage.getItem(key)) {
			return JSON.parse(sessionStorage.getItem(key));
		}
		return {};
	}
	mod.getSessionMapValue = function(storageKey, key) {
		var map = mod.getSessionMap(storageKey);
		console.log("***getSessionMapValue***获取的部门已选择的人的数组" + JSON.stringify(map));
		if(map[key]) {
			return map[key];
		}
		return [];
	}
	mod.setSessionMapValue = function(storageKey, key, value) {
		var map = mod.getSessionMap(storageKey);
		map[key] = value;
		sessionStorage.setItem(storageKey, JSON.stringify(map));
		console.log("****setSessionMapValue***放置的本地值：" + JSON.stringify(map));
	}
	mod.getSessionObject = function(key) {
		if(sessionStorage.getItem(key)) {
			return JSON.parse(sessionStorage.getItem(key))
		}
		return {}
	}
	mod.setSessionObject = function(key, object) {
		sessionStorage.setItem(key, JSON.stringify(object));
	}

	/**
	 * 返回一个安卓手机返回键无法关闭的等待框
	 * @author 莫尚霖
	 * @param {Object} string 等待框显示的文字，默认'加载中...'
	 */
	mod.showWaiting = function(string) {
		var title = '加载中...';
		if(string) {
			title = string;
		}
		var showWaiting = plus.nativeUI.showWaiting(title, {
			back: 'none'
		});
		return showWaiting;
	}

	/**
	 * 关闭一个或所有的等待框
	 * @author 莫尚霖
	 * @param {Object} waiting 等待框对象
	 */
	mod.closeWaiting = function(waiting) {
		if(waiting) {
			waiting.close();
		} else {
			plus.nativeUI.closeWaiting();
		}
	}
	/**
	 * 	获取参数
	 * @param {Object} url_string
	 * @param {Object} param
	 */
	mod.getUrlParam = function(url_string, param) {
		try {
			var eurl = new URL(url_string);
			return eurl.searchParams.get(param);
		} catch(e) {
			if(!url_string) {
				url_string = location.href;
			}
			param = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + param + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(url_string);
			return results == null ? null : results[1];
		}

	}
	/**
	 * 设置自动刷新
	 */
	mod.setShowAutoFresh = function() {
		window.onpageshow = function(event) {
			console.log("自动刷新：" + event.persisted)
			if(event.persisted) {
				window.location.reload();
			}
		};
	}

	/**
	 * 将界面的焦点清除后再退出当前界面
	 */
	mod.blurBack = function() {
		var oldBack = mui.back;
		mui.back = function() {
			document.activeElement.blur();
			oldBack();
		}
	}

	/**
	 * 初始化强制隐藏键盘
	 * @author 莫尚霖
	 */
	mod.initHideKeyBoard = function() {
		if(plus.os.name == 'Android') {
			var Context = plus.android.importClass("android.content.Context");
			var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
			var main = plus.android.runtimeMainActivity();
			var inputManger = main.getSystemService(Context.INPUT_METHOD_SERVICE);
			var Focus = plus.android.invoke(main, 'getCurrentFocus');
			////console.log('invoke ' + plus.android.invoke(main, 'getCurrentFocus'));
			////console.log('invoke ' + plus.android.invoke(Focus, 'getWindowToken'));
			var WindowToken = plus.android.invoke(Focus, 'getWindowToken');
			var hideOption = {
				manger: inputManger,
				token: WindowToken,
				type: InputMethodManager.HIDE_NOT_ALWAYS
			}
			return hideOption;
		}
	}

	/**
	 * 强制隐藏键盘需要和initHideKeyBoard配合使用
	 * @author 莫尚霖
	 * @param {Object} hideOption initHideKeyBoard 返回的数据
	 */
	mod.hideKeyBoard = function(hideOption) {
		document.activeElement.blur();
		if(plus.os.name == 'Android') {
			hideOption.manger.hideSoftInputFromWindow(hideOption.token, hideOption.type);
		}
	}
	return mod;
})(events || {})