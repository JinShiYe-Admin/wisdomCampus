//

function getUUID() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for(var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";
	var uuid = s.join("");
	return uuid;
}

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

//url,
//encryData,需要加密的字段
//commonData,不需要加密的对象
//flag,0表示不需要合并共用数据，1为添加uuid、utid、token、appid普通参数，2为uuid、appid、token
//callback,返回值
var postDataEncry = function(url, encryData, commonData, flag, callback) {
	//拼接登录需要的签名
	var signTemp = postDataEncry1(encryData, commonData, flag);

	//生成签名，返回值sign则为签名
	signHmacSHA1.sign(signTemp, 'jsy309', function(sign) {
		console.log('signtemp:'+signTemp+',sign:'+sign);
		//组装发送握手协议需要的data
		//合并对象
		var tempData = $.extend(encryData, commonData);
		//添加签名
		tempData.sign = sign;
		// 等待的对话框
		var urlArr = url.split('/');
		console.log('传递的参数' + urlArr[urlArr.length - 1] + ':', tempData);
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
			},
			error: function(xhr, type, errorThrown) {
				console.log("网络连接失败" + url + ":" + type + "," + errorThrown + ":", xhr);
			}
		});
	});
}

//拼接参数
var postDataEncry1 = function(encryData, commonData, flag) {
	//循环
	var tempStr = '';
	for(var tempData in encryData) {
		//对value进行加密
		var encryptStr = RSAEncrypt.enctype(encryData[tempData]);
		//修改值
		encryData[tempData] = encryptStr;
	}
	//判断是否需要添加共用数据
	if(flag == 1) {
		//获取个人信息
//		var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
//		var personalToken = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).token;
//		var comData = {
//			uuid: plus.device.uuid,
//			utid: personalUTID,
//			token: personalToken,
//			appid: plus.runtime.appid
//		};
//		commonData = $.extend(commonData, comData);
	} else if(flag == 2) {
		//获取个人信息
//		var personalToken = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).token;
//		var comData = {
//			uuid: plus.device.uuid,
//			token: personalToken,
//			appid: plus.runtime.appid
//		};
//		commonData = $.extend(commonData, comData);
	} else if(flag == 3) {
		//获取个人信息
//		var personalToken = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).token;
//		var comData = {
//			token: personalToken
//		};
//		commonData = $.extend(commonData, comData);
	}
	//将对象转为数组
	var arr0 = [];
	for(var item in encryData) {
		arr0.push(item + '=' + encryData[item]);
	};
	var arr1 = [];
	for(var item in commonData) {
		arr1.push(item + '=' + commonData[item]);
	};
	//合并数组
	var signArr = arr0.concat(arr1);
	//拼接登录需要的签名
	var signTemp = signArr.sort().join('&');
	return signTemp;
}

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
		console.log("XHRP:ontimeout222:", e);
		callback({
			RspCode: 404,
			RspData: null,
			RspTxt: "网络连接失败,请重新尝试一下"
		});
	};
	xhr.onerror = function(e) {
		console.log("XHRP:onerror111:", e);
		callback({
			RspCode: 404,
			RspData: null,
			RspTxt: "网络连接失败,请重新尝试一下"
		});
	};
	xhr.send(data);
}

var jQAjaxPost = function(url, data, callback) {
	console.log('jQAP-Url:', url);
	console.log('jQAP-Data:', data);
	jQuery.ajax({
		url: url,
		type: "POST",
		data: data,
		timeout: 30000,
		dataType: "json",
		contentType: "application/json",
		async: true,
		success: function(success_data) { //请求成功的回调
			console.log('jQAP-Success:', success_data);
			callback(success_data);
		},
		error: function(xhr, type, errorThrown) {
			console.log('jQAP-Error777:', xhr, type);
			callback({
				RspCode: 404,
				RspData: null,
				RspTxt: "网络连接失败,请重新尝试一下"
			});
		}
	});
}

//10.获取发送的通知公告列表
var shakeHandPro = function(callback) {
	var uuid = getUUID();
	console.log('uuid:'+uuid);
	//拼接登录需要的签名
	var commonData = {
		uuid: '16b02e57b4dfb22',
		shaketype: 'login', //注册(reg),登录(login),修改密码(repw)
		appid: 'appid'
	}
	//将对象转为数组
	var arr1 = [];
	for(var item in commonData) {
		arr1.push(item + '=' + commonData[item]);
	};
	//拼接登录需要的签名
	var signTemp = arr1.sort().join('&');
	console.log('signtemp:'+signTemp);
	//生成签名，返回值sign则为签名
	signHmacSHA1.sign(signTemp, 'jsy309', function(sign) {
		console.log('signTemp:'+signTemp+',sign:'+sign);
		//组装发送握手协议需要的data
		//合并对象
		var tempData = $.extend({}, commonData);
		//添加签名
		tempData.sign = sign;
		var tempppp = '{"uuid":"16b02e57b4dfb22","shaketype":"login","appid":"appid","sign":"gcdzLsWf+vFBXIQyd1NTEMkqktM="}';
		mui.ajax('https://jsypay.jiaobaowang.net/useradminwebapi/api/data/ShakeHand', {
			data: JSON.stringify(tempppp),
			dataType: 'json',
			type: 'post',
			contentType: "application/json",
			timeout: 300000,
			//			success: callback,
			success: function(data) {
				console.log("接口获取的值:"+ data);
			},
			error: function(xhr, type, errorThrown) {
				console.log("网络连接失败" + ":" + type + "," + errorThrown + ":", xhr);
			}
		});
		//发送协议
//		jQAjaxPost('https://jsypay.jiaobaowang.net/useradminwebapi/api/data/ShakeHand', JSON.stringify(tempData), callback);
	});
	//	data0 = extendParameter(data0);
	//	xhrPost('https://jsypay.jiaobaowang.net/useradminwebapi', JSON.stringify(data0), callback);
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