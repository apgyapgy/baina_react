import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
// import { Dialog,Button} from 'zent';
// const { openDialog, closeDialog } = Dialog;
var ShowConfirm = function(cont,fn){
	// <Modal
	//     trigger={<Button>提示</Button>} 
	//     header='提示' 
	//     content={cont} 
	//     actions={['取消', { key: 'done', content: '确定', positive: true }]}
	// />
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
var saveOperate = function(obj,info){}
var jumpH5Page = function(obj,url){}
export {ShowConfirm,loadCordova,saveOperate,jumpH5Page}