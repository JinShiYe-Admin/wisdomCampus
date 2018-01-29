//显示用户名的过滤器
Vue.filter('userName', function(userId) {
	var userInfo = departUserInfo.value[userId];
	if(userInfo !== undefined) {
		return userInfo.name; //返回人员信息中的名字
	} else {
		//return userId; //返回传入的值
		return "未知";
	}
});
//显示用户的头像的过滤器
Vue.filter('userImage', function(userId) {
	var userInfo = departUserInfo.value[userId];
	if(userInfo != undefined && userInfo.avatar != "") {
		return userInfo.avatar + "0";
	} else {
		return utils.updateHeadImage("", 2);
	}
});
//显示用户的缩略图头像的过滤器
Vue.filter('userThumbImage', function(userId) {
	var userInfo = departUserInfo.value[userId];
	if(userInfo != undefined && userInfo.avatar != "") {
		return userInfo.avatar + "100";
	} else {
		return utils.updateHeadImage("", 2);
	}
});
//显示图片的过滤器
Vue.filter('imagesArray', function(imagePaths) {
	var images = imagePaths.split('|');
	return images;
});
//显示与我相关的图片的过滤器
Vue.filter('relateImage', function(imagePaths) {
	var images = imagePaths.split('|');
	return images[0];
});
//显示评论的过滤器
Vue.filter('commentArray', function(commentArray) {
	var limit = 20; //只显示前20条
	var filterArray = [];
	for(var i = 0; i < commentArray.length; i++) {
		if(limit == 0) {
			break;
		}
		limit--;
		filterArray.push($.extend(true, {}, commentArray[i]));
		filterArray[i].Replys = [];

		for(var j = 0; j < commentArray[i].Replys.length; j++) {
			if(limit == 0) {
				break;
			}
			limit--;
			filterArray[i].Replys.push($.extend(true, {}, commentArray[i].Replys[j]));
		}
	}
	return filterArray;
});
//显示评论查看全部的过滤器
Vue.filter('showAllButton', function(commentArray) {
	var isShow = false;
	var limit = 20; //超过20条显示查看全部按钮
	for(var i = 0; i < commentArray.length; i++) {
		limit--;
		if(limit == -1) {
			isShow = true;
			break;
		}
		for(var j = 0; j < commentArray[i].Replys.length; j++) {
			limit--;
			if(limit == -1) {
				isShow = true;
				break;
			}
		}
	}
	return isShow;
});

//显示点赞列表的过滤器
Vue.filter('praiserArray', function(praiserArray) {
	var showArray = $.extend([], praiserArray).splice(0, 20);
	var model = {
		num: praiserArray.length, //总长度
		showArray: showArray //显示前20个
	}

	return model;
});

//班级圈主页tab顶部导航
Vue.component("home-navbar-item", {
	template: "#temp_trends_navbar_item",
	props: ["value", "index", "is_on"],
	computed: {
		isOnClass: function() {
			return {
				'weui-bar__item--on': this.index == this.is_on //计算点中的选项
			}
		}
	},
	methods: {
		/**
		 * 点击顶部导航选项
		 * @param {Object} index
		 */
		click: function(index) {
			this.$emit("click-item", index);
		}
	}
});
//班级圈主页tab列表
Vue.component("home-bd-item", {
	template: "#temp_trends_tab_bd_item",
	props: ["value", "index", "is_on"],
	computed: {
		isOnClass: function() {
			return {
				'weui-tab__bd-item--active': this.index == this.is_on //计算显示的列表
			}
		}
	},
	methods: {
		clickPerson: function(userId) {
			this.$emit("click-person", userId);
		},
		clickContent: function(valueIndex) {
			this.$emit("click-content", this.index, valueIndex);
		},
		clickFunction: function(valueIndex, type) {
			this.$emit("click-function", this.index, valueIndex, type);
		},
		clickComment: function(valueIndex, commentIndex, replysIndex) {
			this.$emit("click-comment", this.index, valueIndex, commentIndex, replysIndex);
		},
		/**
		 * 点击与我相关的内容
		 */
		clickRelateContent: function(spaceId) {
			this.$emit("click-relate-content", spaceId);
		},
		/**
		 * 点击与我相关的回复或者回复的内容
		 * @param {Object} replyUserId 回复的id
		 */
		clickRelateReply: function(valueIndex, spaceId, tabId, replyUserId) {
			this.$emit("click-relate-reply", valueIndex, spaceId, tabId, replyUserId);
		},
		clickImage: function(index, images) {
			this.$emit("click-image", index, images);
		}
	}
});

//添加动态，评论，回复组件
Vue.component("add-trends", {
	template: "#temp_add_trends_com",
	props: ["showMedia", "maxlength", "placeholder", "images", "showImage"],
	data: function() {
		return {
			com_content: "", //组件内的content
			showImagePath: "", //显示的图片的路径
			inputValue: "" //input的value
		}
	},
	computed: {
		showGallery: function() {
			if(this.showImage) {
				return {
					display: 'block'
				}
			} else {
				return {
					display: 'none'
				}
			}
		}
	},
	methods: {
		/**
		 * 点击添加多媒体
		 * @param {Object} type 0,图库;1,相机
		 */
		addMedia: function(type) {
			this.$emit("add-media", type);
		},
		/**
		 * 点击提交按钮
		 */
		submitData: function() {
			this.$emit("submit-data");
		},
		/**
		 * 清理输入框内容
		 */
		cleanContent: function() {
			this.com_content = "";
		},
		/**
		 * 点击图片
		 * @param {Object} image_index
		 */
		cilckImage: function(image_index) {
			this.showImagePath = this.images[image_index].filePath
			this.$emit("click-image", image_index);
		},
		/**
		 * 点击当前显示的图片
		 */
		clickShowImage: function() {
			this.showImagePath = "";
			this.$emit("click-show-image");
		},
		/**
		 * 点击删除图片
		 */
		clickDelImage: function() {
			var self = this;
			$.confirm({
				title: '提示',
				text: '确定删除？',
				onOK: function() {
					self.$emit("click-del-image");
				}
			});
		},
		inputChange: function(e) {
			this.$emit("input-change", e.target.value, e.target.files);
			//$('#uploaderInput').val('');
		}
	},
	watch: {
		/**
		 * 监控组件外的content
		 * @param {Object} val
		 */
		content: function(val) {
			this.com_content = val;
		},
		/**
		 * 监控组件内的content
		 * @param {Object} val
		 */
		com_content: function(val) {
			this.$emit("content-change", val);
		}
	}
});
//动态组件
Vue.component("trends-item", {
	template: "#template_trends",
	props: ["value", "index", "detail"],
	computed: {
		showPraiseComment: function() {
			//是否显示点赞和评论区域
			return this.value.LikeUsers.length > 0 || this.value.Comments.length > 0;
		},
		/**
		 * 是否显示删除按钮
		 */
		showTrash: function() {
			if(this.value.PublisherId === mineUserInfo.userid) {
				return true;
			} else {
				return false;
			}
		},
		showLine: function() {
			//是否显示点赞和评论之间的横线
			return this.value.LikeUsers.length > 0 && this.value.Comments.length > 0;
		}
	},
	methods: {
		/**
		 * 点击发布动态者的头像或名称
		 */
		clickPerson: function() {
			this.$emit("click-person", this.value.PublisherId);
		},
		/**
		 * 点击动态的内容
		 * @param {Number} index 动态在列表中的序号
		 */
		clickContent: function() {
			this.$emit("click-content", this.index);
		},
		/**
		 * 点击动态的赞，评论，删除按钮
		 * @param {String} type 按钮序号 0,赞;1,评论;2,删除;
		 */
		clickFunction: function(type) {
			this.$emit("click-function", this.index, type);
		},
		/**
		 * 点击评论或者回复的内容
		 * @param {Object} commentIndex 评论的序号
		 * @param {Object} replysIndex 回复的序号
		 */
		clickComment: function(commentIndex, replysIndex) {
			this.$emit("click-comment", this.index, commentIndex, replysIndex);
		},
		/**
		 * 点击评论区域的查看全部按钮
		 */
		clickShowAll: function() {
			this.$emit("click-content", this.index);
		},
		/**
		 * 点击评论者或者回复者的名字
		 * @param {Object} userId 用户的id
		 */
		clickName: function(userId) {
			this.$emit("click-person", userId);
		},
		/**
		 * 头像加载成功
		 * @param {Object} e
		 */
		headLoad: function(e) {
			var img = e.target;
			var imgWidth = img.width;
			var imgHeight = img.height;
			if(imgWidth > imgHeight) {
				img.style.height = "40px";
				img.style.width = 'initial';
			}
		},
		/**
		 * 头像加载失败
		 * @param {Object} e
		 */
		headError: function(e) {
			e.target.src = utils.updateHeadImage("");
		},
		clickImage: function(index, images) {
			this.$emit("click-image", index, images);
		}
	}
});
//与我相关组件
Vue.component("relate-item", {
	template: "#temp_relate_to_me",
	props: ["value", "index"],
	computed: {
		relateType: function() {
			if(this.value.MsgType == 3) {
				return true;
			} else {
				return false;
			}
		}
	},
	methods: {
		/**
		 * 头像加载成功
		 * @param {Object} e
		 */
		headLoad: function(e) {
			var img = e.target;
			var imgWidth = img.width;
			var imgHeight = img.height;
			if(imgWidth > imgHeight) {
				img.style.height = "40px";
				img.style.width = 'initial';
			}
		},
		/**
		 * 动态图片加载成功
		 * @param {Object} e
		 */
		trendsLoad: function(e) {
			var img = e.target;
			var imgWidth = img.width;
			var imgHeight = img.height;
			if(imgWidth > imgHeight) {
				img.style.height = "50px";
				img.style.width = 'initial';
			}
		},
		/**
		 * 头像加载失败
		 * @param {Object} e
		 */
		headError: function(e) {
			e.target.src = utils.updateHeadImage("");
		},
		/**
		 * 点击用户头像或名称
		 * @param {Object} userId 用户的id
		 */
		clickPerson: function(userId) {
			this.$emit("click-person", userId);
		},
		/**
		 * 点击内容
		 */
		clickRelateContent: function() {
			this.$emit("click-relate-content", this.value.SpaceId);
		},
		/**
		 * 点击回复或者回复的内容
		 */
		clickRelateReply: function(replyUserId) {
			this.$emit("click-relate-reply", this.index, this.value.SpaceId, this.value.TabId, replyUserId);
		}
	}
});
//评论组件
Vue.component("comments-item", {
	template: "#temp_comments",
	props: ["value", "show"],
	methods: {
		/**
		 * 点击评论或者回复的内容
		 * @param {Object} commentIndex 评论的序号
		 * @param {Object} replysIndex 回复的序号
		 */
		clickComment: function(commentIndex, replysIndex) {
			this.$emit("click-comment", commentIndex, replysIndex);
		},
		/**
		 * 点击评论区域的查看全部按钮
		 */
		clickShowAll: function() {
			this.$emit("click-show-all");
		},
		/**
		 * 点击评论者或者回复者的名字
		 * @param {Object} userId 用户的id
		 */
		clickName: function(userId) {
			this.$emit("click-name", userId);
		}
	}
});
//显示图片组件
Vue.component("image-item", {
	template: "#temp_show_image",
	props: ["images", "imagesThumb"],
	methods: {
		/**
		 * 浏览图片原图
		 * @param {Object} index 需要显示的图片的序号
		 */
		showImage: function(index) {
			if(index > this.imagesThumb.length - 1) {
				return false;
			}
			this.$emit("click-image", index, this.images);
		},
		imageError: function(e, index) {
			e.target.src = this.images[index];
		},
		imageLoad: function(e) {
			var img = e.target;
			var imgWidth = img.offsetWidth;
			var imgHeight = img.offsetHeight;
			if(imgWidth > imgHeight) {
				img.style.height = imgWidth + "px";
				img.style.width = imgWidth * imgWidth / imgHeight + "px";
			}
		}
	}
});
//点赞列表组件
Vue.component("praiser-item", {
	template: "#temp_praiser_list",
	props: ["likers"],
	methods: {
		/**
		 * 点击点赞人的名字
		 * @param {Object} userId 用户的id
		 */
		clickName: function(userId) {
			this.$emit("click-name", userId);
		}
	}
});
//异常
Vue.component("error-item", {
	template: "#temp_error_com",
	props: ["type"],
	methods: {
		clickRefresh: function() {
			this.$emit("click-refresh");
		}
	},
	computed: {
		classObject: function() {
			return {
				"error-refresh": this.type == 0
			}
		}
	}
});

/**
 * 班级圈协议
 * 使用前必须先引入jQuery,PublicProtocol.js,storageutil.js
 */
var classCircleProtocol = (function(mod) {
	//模块
	mod.USERSPACE = "userSpace/";

	//1.（用户空间）获取用户针对某用户的空间列表
	mod.getUserSpacesByUserForPublisher = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "getUserSpacesByUserForPublisher", data, callback);
	}

	//2.（用户空间）获取用户某条用户空间是否点赞
	mod.getIsLikeUserSpaceByUser = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "getIsLikeUserSpaceByUser", data, callback);
	}

	//3.（用户空间）获取用户空间所有点赞用户
	mod.getIsLikeUsersById = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "getIsLikeUsersById", data, callback);
	}

	//4.（用户空间）获取多用户空间列表
	mod.getUserSpacesByUser = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "getUserSpacesByUser", data, callback);
	}

	//5.（用户空间）新增某用户空间信息
	mod.addUserSpace = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "addUserSpace", data, callback);
	}

	//6.（用户空间）新增某用户某用户空间评论
	mod.addUserSpaceComment = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "addUserSpaceComment", data, callback);
	}

	//7.（用户空间）新增某用户某用户空间评论回复
	mod.addUserSpaceCommentReply = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "addUserSpaceCommentReply", data, callback);
	}

	//8.（用户空间）修改某用户针对某发布用户的空间阅读状态为已读
	mod.setUserSpaceReadByUser = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "setUserSpaceReadByUser", data, callback);
	}

	//9.（用户空间）修改某用户某用户空间点赞状态为点赞
	mod.setUserSpaceLikeByUser = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "setUserSpaceLikeByUser", data, callback);
	}

	//10.（用户空间）删除某用户空间
	mod.delUserSpaceById = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "delUserSpaceById", data, callback);
	}

	//11.（用户空间）删除某条用户空间评论
	mod.delUserSpaceCommentById = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "delUserSpaceCommentById", data, callback);
	}

	//12.（用户空间）获取与我相关
	mod.getAboutMe = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "getAboutMe", data, callback);
	}

	//13.（用户空间）修改某用户评论、回复、留言状态为已读
	mod.setCommentMsgReadByUser = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "setCommentMsgReadByUser", data, callback);
	}

	//14.（用户空间）新增用户空间
	mod.addNewUserSpaceInfo = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "addNewUserSpaceInfo", data, callback);
	}

	//15.（用户空间）获取用户空间所有已读用户
	mod.getReadUserBySpaceId = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "getReadUserBySpaceId", data, callback);
	}

	//16.（用户空间）删除某用户某用户空间点赞
	mod.delUserSpaceLikeByUser = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "delUserSpaceLikeByUser", data, callback);
	}

	//17.（用户空间）获取多用户空间所有用户动态列表
	mod.getAllUserSpacesByUser = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "getAllUserSpacesByUser", data, callback);
	}

	//18.（用户空间）获取多班级多用户空间所有用户未读数
	mod.getNoReadCntForClassByUser = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "getNoReadCntForClassByUser", data, callback);
	}

	//19.（用户空间）获取用户针对某条空间详情
	mod.getUserSpaceByUser = function(data, callback) {
		mod.setRequest(mod.USERSPACE + "getUserSpaceByUser", data, callback);
	}

	//发送请求
	mod.setRequest = function(url, data, callback) {
		//公共参数，必传
		data.uuid = "";
		data.appid = "";
		data.token = "";
		data.sign = "";
		url = storageutil.CLASSCIRCLEMAIN + url;
		xhrPost(url, JSON.stringify(data), callback);
	}

	return mod;

})(window.classCircleProtocol || {});