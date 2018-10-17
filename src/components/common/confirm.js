import React,{ Component } from 'react';
import { Button, Confirm } from 'semantic-ui-react';
import {connect} from 'react-redux';
import store from '../../reducer/store.js';
// import {setLoginId,setFrom,setLoaded} from '../../reducer/plan.js';
class ConfirmExampleConfirm extends Component {
	constructor(props){
		super(props);
	}
	open = () => {
		this.setState({ open: true });
		console.log("open");
	}
	close = () => {
		console.log("close");
		this.setState({ open: false });
	}
	render() {
		return (
			<div className='modal_wrapper'>
			    <div className='modal clearfix'>
			      <span className='modal_title'>提示</span>
			      <span className='modal_info'>{this.props.globalData.modalCont}</span>
			      <div className="btns">
			      	<button className='modal_btn' onClick={()=>{this.props.cancel()}}>{this.props.cancelText?this.props.cancelText:'取消'}</button>
			      	<button className='modal_btn' onClick={()=>{this.props.confirm()}}>{this.props.confirmText?this.props.confirmText:'确定'}</button>
			      </div>
			    </div>
			</div>
		)
	}
}
const mapStateToProps = function(store){
	return{
		globalData:store.globalData
	}
}
export default connect(mapStateToProps)(ConfirmExampleConfirm);