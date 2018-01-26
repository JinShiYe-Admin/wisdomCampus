
//握手
var shakeHand = function(){
	var url = 'https://jsypay.jiaobaowang.net/useradminwebapi';
	//拼接登录需要的签名
	var commonData = {
			uuid: plus.device.uuid,
			shaketype: 'login',//注册(reg),登录(login),修改密码(repw)
			appid: plus.runtime.appid,
		};
	//将对象转为数组
	var arr1 = [];
	for(var item in commonData) {
		arr1.push(item + '=' + commonData[item]);
	};
	//拼接登录需要的签名
	var signTemp = arr1.sort().join('&');
	//生成签名，返回值sign则为签名
	signHmacSHA1.sign(signTemp, storageKeyName.SIGNKEY, function(sign) {
		//组装发送握手协议需要的data
		//合并对象
		var tempData = $.extend({}, commonData);
		//添加签名
		tempData.sign = sign;
		// 等待的对话框
//		var urlArr = url.split('/');
//		console.log('传递的参数' + urlArr[urlArr.length - 1] + ':', tempData);
//		var tepTime = tempTime();
		//发送协议

		mui.ajax(url, {
			data: JSON.stringify(tempData),
			dataType: 'json',
			type: 'post',
			contentType: "application/json",
			timeout: 30000,
			//			success: callback,
			success: function(data) {
				console.log(urlArr[urlArr.length - 1] + "接口获取的值:", data);
//				callback(data);
			},
			error: function(xhr, type, errorThrown) {
				console.log("网络连接失败" + ":" + type + "," + errorThrown + ":", xhr);
				//console.log('网络连接失败:' + url + ':' + type + ',' + JSON.stringify(xhr) + ',' + errorThrown);
				var data = {
					RspCode: '404',
					RspData: '',
					RspTxt: '网络连接失败，请重新尝试一下'
				}

				callback(data);
				//mui.toast("网络连接失败，请重新尝试一下");
			}
		});
	});
}

//拼接参数--签名
//function postDataEncry1(commonData, flag) {
//	//循环
//	var tempStr = '';
//		//获取个人信息
//		var comData = {
//			uuid: plus.device.uuid,
//			shaketype: 'login',//注册(reg),登录(login),修改密码(repw)
//			appid: plus.runtime.appid,
//		};
//		commonData = $.extend(commonData, comData);
//	//将对象转为数组
//	var arr1 = [];
//	for(var item in commonData) {
//		arr1.push(item + '=' + commonData[item]);
//	};
//	//拼接登录需要的签名
//	var signTemp = arr1.sort().join('&');
//	return signTemp;
//}


/**
 * 发送 XMLHttpRequest post 的请求
 * @param {Object} url 路径
 * @param {Object} data 数据
 * @param {Object} callback 回调
 */
var xhrPost = function(url, data, callback) {
	console.log('XHRP-Url:', url);
	console.log('XHRP-Data:', data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.timeout = 30000; //10秒超时
	xhr.onload = function(e) {
		console.log("XHRP:onload:", e);
		if(this.readyState === 4 && this.status === 200) {
			var success_data = JSON.parse(this.responseText);
			console.log('XHRP-Success:', success_data);
			if(success_data.RspCode == 0013) {
				callback({
					RspCode: 404,
					RspData: null,
					RspTxt: "用户没有登录或超时,关闭当前页,重新从企业管理端登录."
				});
			} else {
				callback(success_data);
			}
		} else {
			callback({
				RspCode: 404,
				RspData: null,
				RspTxt: "网络连接失败,请重新尝试一下"
			});
		}
	}
	xhr.ontimeout = function(e) {
		console.log("XHRP:ontimeout:", e);
		callback({
			RspCode: 404,
			RspData: null,
			RspTxt: "网络连接失败,请重新尝试一下"
		});
	};
	xhr.onerror = function(e) {
		console.log("XHRP:onerror:", e);
		callback({
			RspCode: 404,
			RspData: null,
			RspTxt: "网络连接失败,请重新尝试一下"
		});
	};
	xhr.send(data);
}

//智慧校园协议
var tempAttendUrl = 'https://jbyj.jiaobaowang.net/SchoolOAService/notice/';

//合并参数
var extendParameter = function(data0) {
	var tempData = {
		uuid: '',
		appid: '',
		token: '',
		sign: ''
	}
	return $.extend(data0, tempData);
}

//10.获取发送的通知公告列表
var getSendNoticePro = function(data0, callback) {
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getSendNotice', JSON.stringify(data0), callback);
}

//11.获取收到的通知公告列表（接收人为单人）
var getReceiveNoticePro = function(data0, callback) {
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getReceiveNotice', JSON.stringify(data0), callback);
}

//12.通过ID获取通知公告
var getNoticeByIdPro = function(data0, callback) {
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getNoticeById ', JSON.stringify(data0), callback);
}
