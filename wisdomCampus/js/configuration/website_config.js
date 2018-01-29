var webConfig = {}; //网站配置的数据
var vm_loading; //等待框
var vm_input; //输入框
var vm_skin; //皮肤选项
var vm_image; //图片列表
var vm_switch; //开关
var logoUploader; //上传logo七牛对象
var bannerUploader; //上传banner七牛对象
var uptokenData; //上传的token

window.onload = function() {
	initVueVM();
	initUploader();
	getWebsitConfig(); //获取配置
	//---假数据---start---
	//	initWebsiteConfig(webConfig);
	//	vm_loading.isShow = false;
	//---假数据---end---
};

/**
 * 初始化Vue的vm
 */
function initVueVM() {
	//等待框
	vm_loading = new Vue({
		el: "#loading",
		data: {
			isShow: true,
			content: "数据加载中"
		}
	});

	//输入框
	vm_input = new Vue({
		el: '#input_list',
		data: {
			isShow: false,
			inputArray: [{
				callcol: "cname",
				title: "中文名",
				message: "",
				type: "text",
				maxlength: 25,
			}, {
				callcol: "ename",
				title: "英文名",
				message: "",
				type: "text",
				maxlength: 25,
			}, {
				callcol: "corptel",
				title: "单位联系方式",
				message: "",
				type: "tel",
				maxlength: 25,
			}]
		}
	});
	//皮肤选项
	vm_skin = new Vue({
		el: '#skin',
		data: {
			isShow: false,
			callcol: "skinid",
			skinId: 0
		}
	});
	//图片列表
	vm_image = new Vue({
		el: "#image_list",
		data: {
			isShow: false,
			imageArray: [{
				callcol: "logo",
				title: "logo",
				imageurl: "",
				showimage: false,
				id: "btn_logo",
				parid: "cell_logo",
				showupload: false,
				showlocalimage: false,
				fbase: "",
				fname: "",
				fsize: ""
			}, {
				callcol: "banner",
				title: "banner",
				imageurl: "",
				showimage: false,
				id: "btn_banner",
				parid: "cell_banner",
				showupload: false,
				showlocalimage: false,
				fbase: "",
				fname: "",
				fsize: ""
			}]
		}
	});
	//开关
	vm_switch = new Vue({
		el: '#switch_list',
		data: {
			isShow: false,
			switchArray: [{
				callcol: "stat",
				title: "网站是否启用",
				check: 0
			}, {
				callcol: "isreply",
				title: "整站文章是否允许回复",
				check: 0
			}, {
				callcol: "isnewchk",
				title: "是否允许文章先发后审",
				check: 0
			}, {
				callcol: "isnewreplychk",
				title: "是否允许回复先发后审",
				check: 0
			}, {
				callcol: "isfileup",
				title: "是否允许文章上传附件",
				check: 0
			}, {
				callcol: "isfiledown",
				title: "是否允许附件被下载",
				check: 0
			}, {
				callcol: "iswrite",
				title: "是否允许文章普通人员投稿",
				check: 0
			}, {
				callcol: "isass",
				title: "是否允许评论被评价",
				check: 0
			}]
		}
	});
}

/**
 * 初始化logo上传
 */
function initUploader() {
	var logoOption = {
		disable_statistics_report: true, // 禁止自动发送上传统计信息到七牛，默认允许发送
		runtimes: 'html5,flash,html4', // 上传模式,依次退化
		browse_button: vm_image.imageArray[0].id, // 上传选择的点选按钮，**必需**
		uptoken_func: function(file) { // 在需要获取 uptoken 时，该方法会被调用
			//console.log("uptoken_func:" + JSON.stringify(file));
			uptokenData = null;
			uptokenData = getQNUpToken(file);
			//console.log("获取uptoken回调:" + JSON.stringify(uptokenData));
			if(uptokenData && uptokenData.code) { //成功
				return uptokenData.data.Data[0].Token;
			} else {
				vm_loading.isShow = false;
				vm_loading.content = "数据加载中";
				logoUploader.stop();
				var dialog = weui.dialog({
					title: "上传失败",
					content: uptokenData.message,
					className: "custom-classname",
					buttons: [{
						label: "确定",
						type: "primary",
						onClick: function() {
							dialog.hide();
						}
					}]
				});
			}
		},
		unique_names: false, // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
		save_key: false, // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
		get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的 uptoken
		domain: storageutil.QNPBDOMAIN, // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
		max_file_size: '10mb', // 最大文件体积限制
		flash_swf_url: '../../js/lib/plupload/Moxie.swf', //引入 flash,相对路径
		max_retries: 0, // 上传失败最大重试次数
		dragdrop: false, // 开启可拖曳上传
		chunk_size: '4mb', // 分块上传时，每块的体积
		auto_start: false, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
		filters: {
			mime_types: [ //只允许上传图片和zip文件
				{
					title: "Image files",
					extensions: "jpg,png"
				}
			]
		},
		init: {
			'FilesAdded': function(up, files) {
				plupload.each(files, function(file) {
					// 文件添加进队列后,处理相关的事情
					//console.log("FilesAdded:" + JSON.stringify(file));
					vm_image.imageArray[0].showupload = true;
					vm_image.imageArray[0].fname = file.name;
					vm_image.imageArray[0].fsize = cloudutil.transformSize(file.origSize);
					vm_image.imageArray[0].fbase = "";
					//显示文件
					var preloader = new mOxie.Image();
					preloader.onload = function() {
						vm_image.imageArray[0].fbase = preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
						preloader.destroy();
						preloader = null;
					};
					preloader.load(file.getSource());
				});
			},
			'UploadProgress': function(up, file) {
				// 每个文件上传时,处理相关的事情
				//console.log("UploadProgress:up:" + up.id);
				//console.log("UploadProgress:file:" + JSON.stringify(file));
				vm_loading.content = "上传中 " + file.percent + "%";
			},
			'FileUploaded': function(up, file, info) {
				// 每个文件上传成功后,处理相关的事情
				//console.log("FileUploaded:up:" + up.id);
				//console.log("FileUploaded:file:" + JSON.stringify(file));
				//console.log("FileUploaded:info:" + JSON.stringify(info));
				if(info.status == 200) {
					//成功
					vm_loading.content = "数据加载中";
					var data = {
						type: 3,
						index: 0,
						callcol: vm_image.imageArray[0].callcol,
						colv: storageutil.QNPBDOMAIN + JSON.parse(info["response"]).key
					}
					changeWebsiteConfig(data);
				} else {
					var dialog = weui.dialog({
						title: "上传失败",
						content: JSON.stringify(info),
						className: "custom-classname",
						buttons: [{
							label: "确定",
							type: "primary",
							onClick: function() {
								dialog.hide();
							}
						}]
					});
				}
			},
			'Error': function(up, err, errTip) {
				//上传出错时,处理相关的事情
				//console.log("Error:" + up);
				//console.log("Error:" + JSON.stringify(err));
				//console.log("Error:" + errTip);
				vm_loading.isShow = false;
				vm_loading.content = "数据加载中";
				var dialog = weui.dialog({
					title: "操作失败",
					content: pluploadutil.errMes(err.code, errTip),
					className: "custom-classname",
					buttons: [{
						label: "确定",
						type: "primary",
						onClick: function() {
							dialog.hide();
						}
					}]
				});
			},
			'UploadComplete': function() {
				//队列文件处理完毕后,处理相关的事情
				//console.log("UploadComplete");
			},
			'Key': function(up, file) {
				// 若想在前端对每个文件的key进行个性化处理，可以配置该函数
				// 该配置必须要在 unique_names: false , save_key: false 时才生效
				if(uptokenData && uptokenData.code) { //成功
					return uptokenData.data.Data[0].Key;
				}
			}
		}
	}
	logoUploader = Qiniu.uploader(logoOption);

	var bannerOption = {
		disable_statistics_report: true, // 禁止自动发送上传统计信息到七牛，默认允许发送
		runtimes: 'html5,flash,html4', // 上传模式,依次退化
		browse_button: vm_image.imageArray[1].id, // 上传选择的点选按钮，**必需**
		uptoken_func: function(file) { // 在需要获取 uptoken 时，该方法会被调用
			//console.log("uptoken_func:" + JSON.stringify(file));
			uptokenData = null;
			uptokenData = getQNUpToken(file);
			//console.log("获取uptoken回调:" + JSON.stringify(uptokenData));
			if(uptokenData && uptokenData.code) { //成功
				return uptokenData.data.Data[0].Token;
			} else {
				vm_loading.isShow = false;
				vm_loading.content = "数据加载中";
				bannerUploader.stop();
				var dialog = weui.dialog({
					title: "上传失败",
					content: uptokenData.message,
					className: "custom-classname",
					buttons: [{
						label: "确定",
						type: "primary",
						onClick: function() {
							dialog.hide();
						}
					}]
				});
			}
		},
		unique_names: false, // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
		save_key: false, // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
		get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的 uptoken
		domain: storageutil.QNPBDOMAIN, // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
		max_file_size: '10mb', // 最大文件体积限制
		flash_swf_url: '../../js/lib/plupload/Moxie.swf', //引入 flash,相对路径
		max_retries: 0, // 上传失败最大重试次数
		dragdrop: false, // 开启可拖曳上传
		chunk_size: '4mb', // 分块上传时，每块的体积
		auto_start: false, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
		filters: {
			mime_types: [ //只允许上传图片和zip文件
				{
					title: "Image files",
					extensions: "jpg,png"
				}
			]
		},
		init: {
			'FilesAdded': function(up, files) {
				plupload.each(files, function(file) {
					// 文件添加进队列后,处理相关的事情
					//console.log("FilesAdded:" + JSON.stringify(file));
					vm_image.imageArray[1].showupload = true;
					vm_image.imageArray[1].fname = file.name;
					vm_image.imageArray[1].fsize = cloudutil.transformSize(file.origSize);
					vm_image.imageArray[1].fbase = "";
					//显示文件
					var preloader = new mOxie.Image();
					preloader.onload = function() {
						vm_image.imageArray[1].fbase = preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
						preloader.destroy();
						preloader = null;
					};
					preloader.load(file.getSource());
				});
			},
			'UploadProgress': function(up, file) {
				// 每个文件上传时,处理相关的事情
				//console.log("UploadProgress:up:" + up.id);
				//console.log("UploadProgress:file:" + JSON.stringify(file));
				vm_loading.content = "上传中 " + file.percent + "%";
			},
			'FileUploaded': function(up, file, info) {
				// 每个文件上传成功后,处理相关的事情
				//console.log("FileUploaded:up:" + up.id);
				//console.log("FileUploaded:file:" + JSON.stringify(file));
				//console.log("FileUploaded:info:" + JSON.stringify(info));
				if(info.status == 200) {
					//成功
					vm_loading.content = "数据加载中";
					var data = {
						type: 3,
						index: 1,
						callcol: vm_image.imageArray[1].callcol,
						colv: storageutil.QNPBDOMAIN + JSON.parse(info["response"]).key
					}
					changeWebsiteConfig(data);
				} else {
					var dialog = weui.dialog({
						title: "上传失败",
						content: JSON.stringify(info),
						className: "custom-classname",
						buttons: [{
							label: "确定",
							type: "primary",
							onClick: function() {
								dialog.hide();
							}
						}]
					});
				}
			},
			'Error': function(up, err, errTip) {
				//上传出错时,处理相关的事情
				//console.log("Error:" + up);
				//console.log("Error:" + JSON.stringify(err));
				//console.log("Error:" + errTip);
				vm_loading.isShow = false;
				vm_loading.content = "数据加载中";
				var dialog = weui.dialog({
					title: "操作失败",
					content: pluploadutil.errMes(err.code, errTip),
					className: "custom-classname",
					buttons: [{
						label: "确定",
						type: "primary",
						onClick: function() {
							dialog.hide();
						}
					}]
				});
			},
			'UploadComplete': function() {
				//队列文件处理完毕后,处理相关的事情
				//console.log("UploadComplete");
			},
			'Key': function(up, file) {
				// 若想在前端对每个文件的key进行个性化处理，可以配置该函数
				// 该配置必须要在 unique_names: false , save_key: false 时才生效
				if(uptokenData && uptokenData.code) { //成功
					return uptokenData.data.Data[0].Key;
				}
			}
		}
	}
	bannerUploader = Qiniu.uploader(bannerOption);
}

/**
 * 获取网站配置信息
 */
function getWebsitConfig() {
	var tempData = {
		cmd: 'webcfg',
		type: 'find'
	}
	unitWebsitePro(tempData, function(data) {
		//console.log('配置为:' + JSON.stringify(data));
		vm_loading.isShow = false;
		if(data.RspCode == 0) {
			if(data.RspData.length > 0) {
				webConfig = data.RspData[0];
				initWebsiteConfig(webConfig);
			} else {
				weui.alert('没有获取到配置信息')
			}
		} else {
			weui.alert(data.RspTxt);
		}
	});
}

/**
 * 保存并显示网站配置
 */
function initWebsiteConfig(data) {
	//console.log("initWebsiteConfig:" + JSON.stringify(data));
	//输入框
	vm_input.inputArray[0].message = data.cname;
	vm_input.inputArray[1].message = data.ename;
	vm_input.inputArray[2].message = data.corptel;
	//皮肤id
	//vm_skin.skinId = data.skinid;
	//图片
	vm_image.imageArray[0].imageurl = data.logourl;
	vm_image.imageArray[1].imageurl = data.bannerurl;
	//开关
	vm_switch.switchArray[0].check = data.stat;
	vm_switch.switchArray[1].check = data.isreply;
	vm_switch.switchArray[2].check = data.isnewchk;
	vm_switch.switchArray[3].check = data.isnewreplychk;
	vm_switch.switchArray[4].check = data.isfileup;
	vm_switch.switchArray[5].check = data.isfiledown;
	vm_switch.switchArray[6].check = data.iswrite;
	vm_switch.switchArray[7].check = data.isass;
	//显示列表
	showList();
}

/**
 * 显示列表
 */
function showList() {
	vm_input.isShow = true;
	vm_skin.isShow = true;
	vm_image.isShow = true;
	vm_switch.isShow = true;
}

/**
 * 修改网站设置
 * @param {Object} change 修改的数据
 * @param {String} type 类型，0输入;1开关;2皮肤id;3图片
 * @param {String} index 第几个数据
 * @param {String} key 属性
 * @param {String} value 值
 */
function changeWebsiteConfig(change) {
	var commit = {
		cmd: 'webcfg',
		type: 'edit',
		callcol: change.callcol,
		colv: change.colv
	}
	//console.log("changeWebsiteConfig:" + JSON.stringify(commit));
	unitWebsitePro(commit, function(data) {
		//console.log('修改网站设置:' + JSON.stringify(data));
		if(data.RspCode == 0) { //成功
			if(change.type == 2) { //皮肤id
				vm_skin.skinId = commit.colv;
			}
			if(change.type == 3) { //图片
				vm_image.imageArray[change.index].imageurl = commit.colv;
				vm_image.imageArray[change.index].showupload = false;
				vm_image.imageArray[change.index].fname = "";
				vm_image.imageArray[change.index].fsize = "";
				vm_image.imageArray[change.index].fbase = "";
				delImage({
					appId: storageutil.QNQYWXKID,
					urls: [webConfig[commit.callcol]]
				});
			}
			vm_loading.isShow = false;
			weui.toast("操作成功");
			webConfig[commit.callcol] = commit.colv;
		} else {
			if(change.type == 1) { //开关
				vm_switch.switchArray[change.index].check = !change.colv;
			}
			vm_loading.isShow = false;
			weui.dialog({
				title: "操作失败",
				content: data.RspTxt
			});
		}
	});
}

/**
 * 获取七牛上传token
 */
function getQNUpToken(file) {
	var myDate = new Date();
	var fileName = myDate.getTime() + "" + parseInt(Math.random() * 1000);
	var types = file.name.split(".");
	fileName = fileName + "." + types[types.length - 1];
	var getTokenData = {
		appId: storageutil.QNQYWXKID,
		mainSpace: storageutil.QNPUBSPACE,
		saveSpace: storageutil.QNSSPACEWEBCON,
		fileArray: [{
			qnFileName: fileName,
		}]
	}
	var upToken;
	cloudutil.getFileUpTokens(getTokenData, function(data) {
		upToken = data;
	});
	return upToken;
}

/**
 * 删除七牛的文件
 * @param {Object} imagesData
 */
function delImage(imagesData) {
	cloudutil.delCloudFiles(imagesData, function(data) {
		return data;
	});
}