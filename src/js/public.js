// import React from 'react';
// import { Button, Modal } from 'semantic-ui-react';
import store from '../reducer/store.js';
import {setModalFlag,setModalCont} from '../reducer/plan.js';
import { Modal, Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import 'whatwg-fetch';
import fetchJsonp from 'fetch-jsonp';
// import fetch from 'whatwg-fetch';
var isTest = false;
var baseUrl = 'https://dswx-test.fuiou.com/o2oBaina/';

var _state = store.getState();


// console.log("store:",_state.globalData.showModalFlag);
// import { Dialog,Button} from 'zent';
// const { openDialog, closeDialog } = Dialog;

const getAjax = function(options){
  var _url = baseUrl + options.url;
  if(options.params){
    var _str = '?';
    var _params = options.params;
    for(var key in _params){
      if(_str != '?'){
        _str += '&';
      }
      // console.log("aaa",_params,_params[key])
      _str += key + '='+_params[key];
    }
    _url += _str;
  }
  if(options.notShowLoading==undefined || options.notShowLoading == false){
    Toast.loading('加载中',0,()=>{},true);
  }
  fetchJsonp(_url,{
    timeout:3000,
    jsonpCallback:'jsonp'
  }).then(function(res){
    // console.log("res:",res);
    return res.json();
  }).then(function(json) {
    if(options.success){
      options.success(json);
    }
    setTimeout(()=>{
      Toast.hide();
    },500); 
  }).catch(function(ex){
    if(options.notShowLoading==undefined || options.notShowLoading == false){
      setTimeout(()=>{
        Toast.hide();
      },500);
    }
    console.log("parsing failed",ex);
  });
}

//弹框
const alert = Modal.alert;
const showAlert = (options) => {
  var btns = [];
  if(options.cancel){
    btns.push(
      { 
        text: '取消', 
        onPress: () => {
          if(options.cancel){
            options.cancel();
          }
        }, 
        style: 'default' 
      }
    );
  }
  btns.push(
    { 
      text: '确定', 
      onPress: () => {
        if(options.confirm){
          options.confirm();
        }
      } 
    }
  );
  const alertInstance = alert(
    options.title?options.title:'提示',
    options.cont, 
    btns
  );
  setTimeout(() => {
    // 可以调用close方法以在外部close
    console.log('auto close');
    alertInstance.close();
  }, 500000);
};


var showConfirm = function(obj,cont,confirmfn,cancelfn){
	store.dispatch(setModalFlag(true));
	store.dispatch(setModalCont(cont));
	obj.setState({
		showCancel:cancelfn?true:false,
		confirmFn:confirmfn?confirmfn:()=>{obj.setState({showModal:false});},
		cancelFn:cancelfn?cancelfn:()=>{obj.setState({showModal:false});}
	});
}
var loadCordova = function(obj,fn){
  	var _cordovaScript = document.getElementById("cordova");
  	if(_cordovaScript){
  		if(obj.props.globalData.loginId === ''){
      		window.registerDeviceready(function(){
      			fn();
	        });
	  	}else{
	  		console.log("loginId:",obj.props.globalData.loginId);
	  		fn();
	  	}
  	}else{
      	var iOS = /(iPad|iPhone|iPod)/g.test(window.navigator.userAgent);
      	// var Android = /Android/i.test(window.navigator.userAgent);
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
var jumpH5Page = function(obj,url){
  window.location.href = url;
}
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
    if(type===1){
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
var getParmas = function(url,name){
  url = url.substring(1);
  var urlArr = url.split('&');
  var _params = {};
  for(var key in urlArr){
    var _arr = urlArr[key].split('=');
    _params[_arr[0]] = decodeURI(_arr[1]);
  }
  if(name){
    return _params[name];
  }
  return _params;
}
export {
  showConfirm,
  loadCordova,
  saveOperate,
  jumpH5Page,
  getParams,
  getDiffTime,
  showAlert,
  getAjax,
  getParmas
}