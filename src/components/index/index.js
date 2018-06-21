import React,{ Component } from 'react';
import {showConfirm,loadCordova} from '../../js/public.js';
import {connect} from 'react-redux';
import store from '../../reducer/store.js';
import {setLoginId,setFrom,setLoaded} from '../../reducer/plan.js';
import fuApp from '../../js/libs/fuapp.js';
class Index extends Component{
	constructor(props){
		super(props);
		this.initData = this.initData.bind(this);
		this.getActs = this.getActs.bind(this);
	}
	componentWillMount(){
		if(this.props.globalData.loginId == ''){
			loadCordova(this,this.initData);
		}else{
			this.initData();
		}
	}
	componentDidMount(){
		console.log("haha")
	}
	initData(){
		var _this = this;
		if(_this.props.globalData.loginId == ''){
			fuApp.userInfo(function(userInfo){
				console.log("userInfo:",userInfo);
				if(userInfo.rspCode == '0000'){
					store.dispatch(setLoginId(userInfo.loginId))
				}
		  		_this.getActs();
	        },function(){
	        	console.log("获取用户信息失败");
	          	// showAlert({cont:"获取用户信息失败"});
	        });
		}else{
			this.getActs();
		}
	}
	getActs(){
		console.log("getActs:",this.props.globalData.loginId);
	}
	render(){
		return(
			<div>index</div>
		)
	}
}
const mapStateToProps = function(store){
	return{
		globalData:store.globalData
	}
}
export default connect(mapStateToProps)(Index);