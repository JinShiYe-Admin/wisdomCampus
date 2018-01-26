//将发送请求时的参数，进行签名


var signHmacSHA1=(function(mod){
	mod.sign=function(message,value,callback){
			require.config({
				baseUrl:"",
				waitSeconds:5,
				paths:{
					'crypto-js':"../../js/libs/crypto-js/crypto-js"
				}
			});
			var encrypted='';
			require(['crypto-js'], function (CryptoJS) {
				encrypted=CryptoJS.HmacSHA1(message,value).toString(CryptoJS.enc.Base64);
				callback(encrypted);
			});
	};
	return mod;
})(signHmacSHA1||{})