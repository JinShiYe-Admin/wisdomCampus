//输入框组件
Vue.component('input-item', {
	props: ['value', 'index'],
	template: '#temp_input_item',
	methods: {
		oninput: function(index) { //输入时的监听，0中文名，1英文名，2单位联系方式
			//console.log("oninput " + index + " " + vm_input.inputArray[index].message);
			switch(index) {
				case 0: //中文名
					vm_input.inputArray[index].message = vm_input.inputArray[index].message.replace(/[^\u4E00-\u9FA5| ]/g, "").replace(/(^\s*)|(\s*$)/g, "");
					break;
				case 1: //英文名
					vm_input.inputArray[index].message = vm_input.inputArray[index].message.replace(/[^a-zA-Z| ]/g, "").replace(/(^\s*)|(\s*$)/g, "");
					break;
				case 2: //单位联系方式
					vm_input.inputArray[index].message = vm_input.inputArray[index].message.replace(/[^\d]/g, "")
					break;
				default:
					break;
			}
		},
		onblur: function(index) { //失去焦点时的监听，0中文名，1英文名，2单位联系方式
			if(vm_input.inputArray[index].message != webConfig[vm_input.inputArray[index].callcol]) {
				//有改变
				if(vm_input.inputArray[index].message == "") {
					//为空
					vm_input.inputArray[index].message = webConfig[vm_input.inputArray[index].callcol];
				} else {
					layer.load(2);
					var data = {
						type: 0,
						index: index,
						callcol: vm_input.inputArray[index].callcol,
						colv: vm_input.inputArray[index].message
					}
					changeWebsiteConfig(data);
				}
			}
		}
	}
});
//图片组件
Vue.component("image-item", {
	props: ['value', 'index'],
	template: '#temp_image_item',
});

//开关组件
Vue.component('switch-item', {
	props: ['value', 'index'],
	template: '#temp_switch_item',
	methods: {
		onchange: function(index) {
			if(vm_switch.switchArray[index].check != webConfig[vm_switch.switchArray[index].callcol]) {
				layer.load(2);
				var data = {
					type: 1,
					index: index,
					callcol: vm_switch.switchArray[index].callcol,
					colv: vm_switch.switchArray[index].check * 1
				}
				changeWebsiteConfig(data);
			}
		}
	}
});