//此js用于保存本地存储时，用到的key值

var storageKeyName = (function(mod) {

	mod.key = 0; //0开发，1云测试，2部署
	var exLog = console.log;
	// console.log = function(hint, object) {
	// 	if(mod.key === 0) {
	// 		var argus = hint;
	// 		if(typeof(object) !== 'undefined') {
	// 			argus = hint + JSON.stringify(object);
	// 		}
	// 		exLog.apply(this, [argus]);
	// 	}
	// }
	switch(mod.key) {
		case 0: //开发
			mod.SCHOOLID = 100005; //学校ID
			mod.USERTYPE = 0; //用户类型，0老师,1家长,2学生
			mod.INTERFACEGU = 'https://jsypay.jiaobaowang.net/useradminwebapi/api/data/'; //顾工接口
			mod.INTERFACEZENG = 'http://139.129.252.49:8080/sup/'; //系统接口
			mod.INTERFACEMENG = 'http://139.129.252.49:8080/sys/'; //系统接口
			mod.INTERFACEKONG = 'https://jbyj.jiaobaowang.net/SchoolOAServiceNew/'; //孔工接口
			mod.INTERFACESIGNINKONG = 'https://jbyj.jiaobaowang.net/SchoolAttendanceService/'; //孔工接口IMG
			mod.TEACHERIMG = 'http://jsypay.jiaobaowang.net/jsyadmin/upuserimg.ashx?userid='; //老师上传头像
			mod.ANDROIDUPDATEURL = 'http://192.168.1.121:8081/app/versionCode.xml';
			mod.STUDENTMANAGE = 'https://gxkf.jiaobaowang.net:9443/sm/app/'; //学生管理
			//---七牛空间和接口---
			mod.QNPB = 'https://qn-educds.jiaobaowang.net/'; //公开空间域名
			mod.QNGETUPLOADTOKEN = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen';
			mod.QNGETUPTOKENHEADIMGE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
			mod.QNGETUPTOKENFILE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
			mod.QNGETDOWNTOKENFILE = 'http://114.215.222.186:8007/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
			mod.QNGETTOKENDELETE = 'http://114.215.222.186:8007/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url
			break;
		case 1: //云测试
			mod.SCHOOLID = 0; //学校ID
			mod.USERTYPE = 0; //用户类型，0老师,1家长,2学生
			mod.INTERFACEGU = 'https://zhxy.jiaobaowang.net:8515/schadminwebapi/api/Data/'; //顾工接口
			mod.INTERFACEZENG = 'http://zhxyx.jiaobaowang.net/sup/'; //系统接口
			mod.INTERFACEMENG = 'http://zhxyx.jiaobaowang.net/hrsys/'; //系统接口
			mod.INTERFACEKONG = 'https://jbyj.jiaobaowang.net:8443/SchoolOAServiceNew/'; //孔工接口
			mod.INTERFACESIGNINKONG = 'https://jbyj.jiaobaowang.net:8443/SchoolAttendanceService/'; //孔工接口IMG
			mod.TEACHERIMG = 'https://zhxy.jiaobaowang.net:8515/schadminwebadmin/upuserimg.ashx?userid='; //老师上传头像
			mod.ANDROIDUPDATEURL = 'https://zhxy.jiaobaowang.net:8515/appupdate/versionCode.xml';
			mod.STUDENTMANAGE = 'https://gxcs.jiaobaowang.net/StudentManager/app/'; //学生管理

			
//			 mod.INTERFACEGU = 'https://boss.zhuxue101.net:444/api/data/'; //顾工接口
//          mod.INTERFACEKONG = 'https://zyja.zhuxue101.net/SchoolOAService/'; //孔工接口
//          mod.INTERFACESIGNINKONG = 'https://zyja.zhuxue101.net/SchoolAttendanceService/'; //孔工接口
//          mod.TEACHERIMG = 'https://boss.zhuxue101.net/upuserimg.ashx?userid='; //老师上传头像
//          mod.ANDROIDUPDATEURL='http://boss.zhuxue101.net:8002/versionCode.xml';

			//---七牛空间和接口---
			mod.QNPB = 'https://qn-educds.jiaobaowang.net/'; //公开空间域名
			mod.QNGETUPLOADTOKEN = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen';
			mod.QNGETUPTOKENHEADIMGE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
			mod.QNGETUPTOKENFILE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
			mod.QNGETDOWNTOKENFILE = 'http://114.215.222.186:8007/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
			mod.QNGETTOKENDELETE = 'http://114.215.222.186:8007/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url
			break;
		case 2: //发布
			mod.SCHOOLID = 100005; //学校ID
			mod.USERTYPE = 0; //用户类型，0老师,1家长,2学生
			mod.INTERFACEGU = 'https://jsypay.jiaobaowang.net/useradminwebapi/api/data/'; //顾工接口
			mod.INTERFACEKONG = 'https://jbyj.jiaobaowang.net/SchoolOAService/'; //孔工接口
			mod.INTERFACESIGNINKONG = 'https://jbyj.jiaobaowang.net/SchoolAttendanceService/'; //孔工接口IMG
			mod.TEACHERIMG = 'http://jsypay.jiaobaowang.net/jsyadmin/upuserimg.ashx?userid='; //老师上传头像
			mod.ANDROIDUPDATEURL = 'http://192.168.1.121:8081/app/versionCode.xml';
			mod.STUDENTMANAGE = 'https://gxkf.jiaobaowang.net:9443/sm/app/'; //学生管理

			//---七牛空间和接口---
			mod.QNPB = 'https://qn-educds.jiaobaowang.net/'; //公开空间域名
			mod.QNGETUPLOADTOKEN = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen';
			mod.QNGETUPTOKENHEADIMGE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
			mod.QNGETUPTOKENFILE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
			mod.QNGETDOWNTOKENFILE = 'http://114.215.222.186:8007/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
			mod.QNGETTOKENDELETE = 'http://114.215.222.186:8007/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url
			break;
		default:
			break;
	}
	
	mod.PLATFORMCODE = 'PT0001'; //平台代码
	mod.APPCODE = 'smartSchAPP'; //应用系统代码
	//七牛上传空间key值
	//资源平台
	mod.QNPUBZYKEY = "jsy8004";
	//教宝云作业
	mod.QNPUBJBYZYKEY = "zy309309!";
	//教宝云盘
	mod.QNPUBJBYPKEY = "jbyp@2017";
	//教宝云用户管理
	mod.QUPUBJBMANKEY = "jbman456";
	//家校圈
	mod.QNPUBJXQKEY = "jxq789!@";
	//求知
	mod.QNPUBQZKEY = "qz123qwe";
	//校讯通
	mod.QNPUBXXT = "jsy@180526";
	//七牛存储子空间（文件二级文件名）
	mod.QNPUBSPACE = "pb"; //七牛公开空间
	mod.QNPRISPACE = "pv"; //七牛私有空间
	mod.XXTNOTICE = 'notice/'; //笔校讯通、通知

	mod.BADGENUMBER = 'badgeNumber' //app角标
	mod.PERSONALINFO = 'personalInfo1111'; //个人信息，登录成功后返回值
	mod.SHAKEHAND = 'ShakeHand'; //公钥，登录时，返回的握手信息，
	mod.AUTOLOGIN = 'autoLogin'; //登录信息
	mod.DOCUMENTSPATH = 'DOCUMENTSPATH'; //记录document的地址

	mod.PUBLICPARAMETER = 'publicParameter' //共用参数
	mod.NEWDETAIL = 'newDetail' //新建通知、事务，记录页面填的数据

	mod.WAITING = '加载中...'; //
	mod.UPLOADING = '上传中...';
	mod.SIGNKEY = 'jsy309'; //签名密钥

	mod.ISFIRST = 'isFitst'; //是否是第一次登陆
	mod.ICONNUM = 0; //角标数量

	//模块权限
	mod.NOTICEAPPROVE_ADD='#OA:NoticeApprove:add'//通知公告、事物审批发布权限
	mod.NOTICE_INDEX='#OA:Notice:index'//通知公告
	mod.APPROVE_INDEX='#OA:Approve:index'//事务审批
	mod.ATTENDANCE_INDEX='#OA:Attendance:index'//签到考勤
	mod.STUMANAGE_INDEX='#OA:StuManage:index'//学生管理
	mod.NOTICEAPPROVE_ALLDPT='#OA:NoticeApprove:allDpt'//全部老师
	mod.NOTICEAPPROVE_UPDPT='#OA:NoticeApprove:upDpt'//上级部门老师
	mod.NOTICEAPPROVE_TEACLS='#OA:NoticeApprove:teaCls'//本年级老师
	mod.NOTICEAPPROVE_DOWNDPT='#OA:NoticeApprove:downDpt'//本部门及下级部门老师
	
	mod.FIRSTOPEN = 'firstOpen';//首次打开，判断是否同意用户协议
	mod.PRIVACE='http://www.jiaobao.net/dl/jiaobaoxiaoyuan/jbxyPrivacy.htm';//用户隐私政策地址
	/**
	 * 在本地存永久数据
	 * @param {Object} key
	 * @param {Object} value
	 */
	mod.setLocalStorage = function(key, value) {
		localStorage.setItem(key, value);
	}

	/**
	 * 取永久数据
	 * @param {Object} key
	 */
	mod.getLocalStorage = function(key) {
		return localStorage.getItem(key);
	}

	/**
	 * 删除单个永久数据
	 * @param {Object} key
	 */
	mod.removeLocalStorage = function(key) {
		localStorage.removeItem(key);
	}

	/**
	 * 删除所有的永久数据
	 */
	mod.clearLocalStorage = function() {
		localStorage.clear();
	}

	/**
	 * 在本地存临时数据
	 * @param {Object} key
	 * @param {Object} value
	 */
	mod.setSessionStorage = function(key, value) {
		sessionStorage.setItem(key, value);
	}

	/**
	 * 取临时数据
	 * @param {Object} key
	 */
	mod.getSessionStorage = function(key) {
		return sessionStorage.getItem(key);
	}

	/**
	 * 删除单个临时数据
	 * @param {Object} key
	 */
	mod.removeSessionStorage = function(key) {
		sessionStorage.removeItem(key);
	}

	/**
	 * 删除所有的临时数据
	 */
	mod.clearSessionStorage = function() {
		sessionStorage.clear();
	}

	return mod;

})(storageKeyName || {});