// import { Dialog,Button} from 'zent';
// const { openDialog, closeDialog } = Dialog;
var ShowConfirm = function(cont,fn){
	// const id = 'my_dialog';
	// openDialog({
	//     dialogId: id, // id is used to close the dialog
	//     title: '提示',
	//     children: <div>{{cont}}</div>,
	//     footer: <Button onClick={() => closeDialog(id)}>关闭</Button>,
	//     onClose() {
	//       console.log('outer dialog closed');
	//     },
	// });
}
var loadCordova = function(obj,fn){
  	var _cordovaScript = document.getElementById("cordova");
  	if(_cordovaScript){
  		if(obj.props.globalData.loginId == ''){
      		window.registerDeviceready(function(){
      			fn();
	        });
	  	}else{
	  		console.log("loginId:",obj.props.globalData.loginId);
	  		fn();
	  	}
  	}else{
      	var iOS = /(iPad|iPhone|iPod)/g.test(window.navigator.userAgent);
      	var Android = /Android/i.test(window.navigator.userAgent);
      	//iOS = false;//测试\
      	var _cordovaJs = 'https://staticds.fuiou.com/sys/fly/app/libs/js/android/cordova.js';
      	if(iOS){
        	_cordovaJs = 'https://staticds.fuiou.com/sys/fly/app/libs/js/ios/cordova.js';
      	}
      	var _script = document.createElement("script");
      	_script.id = "cordova";
      	_script.src = _cordovaJs;
      	document.getElementsByTagName("head")[0].appendChild(_script);
      	_script.onload = function(){
      		window.registerDeviceready(function(){
      			fn();
	       	});
      	}
    }
}

export {ShowConfirm,loadCordova}