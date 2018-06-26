import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
// import { Dialog,Button} from 'zent';
// const { openDialog, closeDialog } = Dialog;
var showConfirm = function(obj,cont,confirmfn,cancelfn){
	obj.setState({
		showModal:true,
		modalCont:cont,
		showCancel:cancelfn?true:false,
		confirmFn:confirmfn?confirmfn:()=>{obj.setState({showModal:false});},
		cancelFn:cancelfn?cancelfn:()=>{obj.setState({showModal:false});}
	});
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
var getParams = function(search){//页面参数格式化
	search = search.substring(1);//把前面的问号去掉
	var _arr = search.split('&');
	var searchArr = {};
	for(var key in _arr){
		var _keyValueArr = _arr[key].split('=');
		searchArr[_keyValueArr[0]] = _keyValueArr[1];
	}
	return searchArr;
}
var getDiffTime = function(endTime,type=1) {
    //type为1表示返回天时分秒,为2返回秒
    endTime = endTime.replace(/-/g, '/');  
    var startTime = new Date();
    var _diff = new Date(endTime).getTime() - startTime.getTime();
    if(_diff <= 0 ){
      	_diff = 0;
    }
    if(type==1){
      	var _days = Math.floor(_diff / (24 * 3600 * 1000));
      	_diff = _diff % (24 * 3600 * 1000);
      	var _hours = Math.floor(_diff / (3600 * 1000));
      	_diff %= 3600 * 1000;
      	var _minutes = Math.floor(_diff / (60 * 1000));
      	_diff %= 60 * 1000;
      	var _seconds = Math.round(_diff / 1000);
      	return {
        	day: _days,
        	hour: _hours,
        	minute: _minutes,
        	second: _seconds
      	}
    }else{
      	return Math.floor(_diff/1000);
    }
}
export {showConfirm,loadCordova,saveOperate,jumpH5Page,getParams,getDiffTime}