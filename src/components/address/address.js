import React,{ Component } from 'react';
import {connect} from 'react-redux';
import store from '../../reducer/store.js';
import {setLoginId,setFrom,setLoaded} from '../../reducer/plan.js';

class Address extends Component{
	constructor(props){
		super(props);
	}
	//显示弹出
	setLoginId(){
		store.dispatch(setLoginId('15316117950'));
		console.log("loginId:",this.props.globalData.loginId);
	}
	//js跳转路由
	detail(id){
		this.props.history.push(`/detail/${id}`)
	}
	render(){
		return(
			<div>
				<p onClick={this.setLoginId.bind(this)} >哈哈</p>
			</div>
		)
	}
}
const mapStateToProps = function(store){
	return{
		globalData:store.globalData
	}
}
export default connect(mapStateToProps)(Address);
// export default Address;