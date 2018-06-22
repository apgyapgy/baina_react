import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter,Route  } from 'react-router-dom';
import './index.css';
// import 'zent/css/index.css';
import './css/common.css';
import './js/fontSize.js';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';

import Activity from './components/activity/activity.js';
import Address from './components/address/address.js';
import Index from './components/index/index.js';
import Mall from './components/mall/mall.js';
import Result from './components/result/result.js';
import MyActs from './components/myActs/myActs.js';
import { Provider, connect } from 'react-redux';
import store from './reducer/store.js';

import 'semantic-ui-css/semantic.min.css';
// import fuApp from './js/libs/fuapp.js';
// window.fuApp = fuApp;
// 注册事件，调原生接口必用
var isDebug = false;//true测试环境,false生产环境
if(window.location.origin == 'http://localhost:3000' || window.location.origin == 'http://192.168.42.33'){
  isDebug = true;
}
window.registerDeviceready = function (devicereadyEvent) {
    //注册deviceready事件
    if(isDebug){
      	devicereadyEvent();
    }else{
      	document.addEventListener("deviceready",function(){
        	devicereadyEvent();
      	});
    }
};

//<Route path='/'  component={Index}/>
ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
		  	<div>
		  		<Route exact path="/" component={Index} />
		    	<Route path='/activity'  component={Activity}/>
		    	<Route path='/address'  component={Address}/>
		    	<Route path='/index'  component={Index}/>
		    	<Route path='/mall'  component={Mall}/>
		    	<Route path='/result'  component={Result}/>
		    	<Route path='/myActs'  component={MyActs}/>
		  	</div>
		</BrowserRouter>
	</Provider>, 
	document.getElementById('root')
);

registerServiceWorker();
