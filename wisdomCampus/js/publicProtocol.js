//

//function uuid() {
//  var s = [];
//  var hexDigits = "0123456789abcdef";
//  for (var i = 0; i < 36; i++) {
//      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
//  }
//  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
//  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
//  s[8] = s[13] = s[18] = s[23] = "-";
//  var uuid = s.join("");
//  return uuid;
//}

//发送对应的网站协议，根据页面传送的data
//var unitWebsitePro = function(data0, callback) {
//	xhrPost('https://jsypay.jiaobaowang.net/wxth/appschweb/schwebapi.aspx', JSON.stringify(data0), callback);
//}

/**
 * 发送 jQuery ajax post 的请求
 * @param {Object} url 路径
 * @param {Object} data 数据
 * @param {Object} callback 回调
 */
//var jQAjaxPost = function(url, data, callback) {
//	console.log('jQAP-Url:', url);
//	console.log('jQAP-Data:', data);
//	jQuery.ajax({
//		url: url,
//		type: "POST",
//		data: data,
//		timeout: 30000,
//		dataType: "json",
//		async: true,
//		success: function(success_data) { //请求成功的回调
//			console.log('jQAP-Success:', success_data);
//			callback(success_data);
//		},
//		error: function(xhr, type, errorThrown) {
//			console.log('jQAP-Error:', xhr, type);
//			callback({
//				RspCode: 404,
//				RspData: null,
//				RspTxt: "网络连接失败,请重新尝试一下"
//			});
//		}
//	});
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
