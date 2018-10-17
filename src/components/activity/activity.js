import React,{ Component } from 'react';
import {showAlert,showConfirm,getParams,loadCordova,jumpH5Page,getDiffTime,getAjax} from '../../js/public.js';
import {connect} from 'react-redux';
import store from '../../reducer/store.js';
import {setLoginId} from '../../reducer/plan.js';//setFrom,,setLoaded,setModalFlag
import fuApp from '../../js/libs/fuapp.js';
import './activity.css';
// import ConfirmExampleConfirm from '../common/confirm.js';
class Activity extends Component{
	constructor(props){
		super(props);
		this.state = {
			activityId:'',//首页传过来的活动id
		    act:{},//活动信息
		    area:{},//地址信息
		    ques:{},//问题们
		    actRecommandImg:'',
		    showQuesModalFlag:false,//是否显示问题弹窗
		    selectAnswIndex:0,//用户选择的问题答案
		    showTrueAnswFlag:false,//是否显示正确答案
		    hostId:'',//绑定终端号
		    bannerImgs:[],//商品banner图片
		    detailImgs:[],//商品详情图片
		    activity_receive_info:''  ,//领取弹窗显示内容
		    isReady:false ,//页面是否准备好，用于定时器与css的动画同步
		    middleTabbarActiveIndex:1,//选 中商品详情与商品评价tab中的哪个
		    showHelpFlag:false,//是否显示帮助弹窗
		    notShowHelpModal:false,//是否选中“下次不再显示弹窗”
		    phoneBinded: false,//用户是否已经绑定手机号
		    showCheckMobileFlag: false,//是否显示验证手机号弹窗
		    mobile: '',//手户手机号
		    yzm: '',//接收的验证码
		    clickable:true,
		    showOpenDoorProgressFlag:false,//是否显示开箱进度弹窗
		    precent:0,//开箱进度
		    showOpenDoorHelpFlag:false,//是否显示扫码引导弹窗
		    showAddressModalFlag:false,//是否显示温馨提示弹窗
		    activityStatus:0,//0扫码领取 1申请 2申请结束
		    endTime:'',//活动结束时间
		    defaultAddr:{//用户收件宝默认地址
		      cellNm: '',
		      hostAddr: '',
		      hostId: '',
		      cellCd: '',
		      cityCd: '',
		      cityNm: ''
		    },
		    actCutDownObj:{//活动倒计时信息
		      day:0,
		      hour:0,
		      minute:0,
		      second:0
		    },
		    canReceiveFlag:false,//是否到了领取时间
		    imgPre:this.props.globalData.imgPre,//图片前缀
		    loadFailFlag:false,//是否加载失败
		    showActRuleModalFlag: false, //是否显示活动流程弹窗
		    confirmFn:null,//弹窗点确认按钮的执行函数
		    cancelFn:null,//弹窗点取消按钮的执行函数
		};
		this.initData = this.initData.bind(this);
		this.getQues = this.getQues.bind(this);
		this.changeMiddleTabbar = this.changeMiddleTabbar.bind(this);
	}
	checkPhoneTimer:null
	activityTimer:null
	componentWillMount(){
		var search = {};
		if(this.props.location.search){
			search = getParams(this.props.location.search);
		}
		var _this = this;
		if(search.aid){
			this.setState({
				activityId:search.aid
			},function(){
				if(this.props.globalData.loginId === ''){
					loadCordova(this,this.initData);
				}else{
					this.initData();
				}
			});
		}else{
			showConfirm(this,'非法页面参数',()=>{
				this.props.history.back();
			});
		}
	}
	initData(){
		console.log("initData")
		var _this = this;
		if(this.props.globalData.loginId === ''){
			fuApp.userInfo(function(userInfo){
				console.log("userInfo:",userInfo);
				if(userInfo.rspCode === '0000'){
					store.dispatch(setLoginId(userInfo.loginId))
				}
		  		_this.toDetail();
	        },function(){
	        	console.log("获取用户信息失败");
	        	showConfirm(_this,'获取用户信息失败');
	        });
		}else{
			this.toDetail();
		}
	}
	toDetail(){
		var _this = this;
		getAjax({
			url:'bainaH5/toDetail',
			params:{
				loginId:_this.props.globalData.loginId,
				actId:_this.state.activityId,
				type:1
			},
			success(res){
				console.log("toDetail:",res);
				if(res.code === 200){
					var _quesArr = _this.getQues(res.data.goodsQuestion);
					_this.setState({
						act : res.data.act,
						area : res.data.area,
						loadFailFlag : false,
						hostId : res.data.usr ? res.data.usr.province:'',
						ques:_quesArr
					});
					if(res.data.act.usrActSt === 1){
						_this.setState({canReceiveFlag:true});
					}
			        _this.getActImgs();//处理返回的数据
			        //_this.checkCutDown();//判断是否进行倒计时
			    } else if (res.code === 308){
		          	if(_this.state.act !== {}){
		          		_this.setState({
		          			loadFailFlag:true
		          		});
		          	}
			        showConfirm(_this,'很抱歉，您的附近暂无白拿活动，现在将为您跳转到白拿商城!',()=>{
			        	_this.props.hostory.push('/mall');
			        });
			    }else{
			        if(_this.act !== {}) {
			            _this.setState({loadFailFlag:true});
			        }
			        if (res.desc !== '请先注册用户并选择好配送终端。'){
			        	showConfirm(_this,res.desc);
			        }
			    }
			}
		});	
	}
	getQues(data){//从问题对象中获取问题选项
	    if(data){
	      	var _answArr = [];
	      	if(data.answer1){
	        	_answArr.push(data.answer1);
	      	}
	      	if (data.answer2) {
	        	_answArr.push(data.answer2);
	      	}
	      	if (data.answer3) {
	        	_answArr.push(data.answer3);
	      	}
	      	if (data.answer4) {
	        	_answArr.push(data.answer4);
	      	}
	      	if (data.answer5) {
	        	_answArr.push(data.answer5);
	      	}
	      	data.answArr = _answArr;
	      	return data;
	    }else{
	      	return {};
	    }
	}
	selectAnsw(_idx){//选择问题选项
		this.setState({
			showTrueAnswFlag:false,
			selectAnswIndex:_idx
		});
	}
	checkCutDown(){//判断是否进行倒计时
	    var _usrActSt = this.state.act.usrActSt;
	    if(_usrActSt === 0){//即将开始
	      this.activityCutDown();
	    }else if(_usrActSt===1){//进行中
	      this.setState({canReceiveFlag:true});
	      this.activityCutDown();
	    }else if(_usrActSt === 2){//配送中直接跳转到结果页面
	    }
	}
	submitAnsw(){//提交答案
	    if (this.state.selectAnswIndex + 1 !== this.state.ques.trueAnswer){//答案错误，显示正确答案
	      	this.setState({showTrueAnswFlag:true});
	    }else{//答案正确
	    	this.setState({
	    		showQuesModalFlag:false
	    	});
	      	this.receive();
	    }
	}
	hideQuesModal(){
	    this.setState({showQuesModalFlag:false});
	}
	changeMiddleTabbar(n){//中间商品详情与商品评价切换
	    this.setState({
	    	middleTabbarActiveIndex:n
	    });
	}
	getActImgs() {//获取活动图片
	    var _bainaData = this.state.act.bainaGoods;
	    var _bannerImgs = [], _detailImgs = [];
	    if (_bainaData.goodsActLogo1!==undefined && _bainaData.goodsActLogo1 !== '') {
	      _bannerImgs.push(_bainaData.goodsActLogo1);
	    }
	    if((this.state.act.usrActSt === 4 || this.state.act.usrActSt===5)&&_bainaData.goodsActLogo4){
	    	_bannerImgs = [_bainaData.goodsActLogo4];
	    }
	    /*
		    if (_bainaData.goodsActLogo2!==undefined && _bainaData.goodsActLogo2 !== '') {
		      _bannerImgs.push(_bainaData.goodsActLogo2);
		    }
		    if (_bainaData.goodsActLogo3!==undefined && _bainaData.goodsActLogo3 !== '') {
		      _bannerImgs.push(_bainaData.goodsActLogo3);
		    }
		    if (_bainaData.goodsActLogo4!==undefined && _bainaData.goodsActLogo4 !== '') {
		      _bannerImgs.push(_bainaData.goodsActLogo4);
		    }
	    */
	    if (_bainaData.goodsDtlLogo1!==undefined && _bainaData.goodsDtlLogo1 !== '') {
	      _detailImgs.push(_bainaData.goodsDtlLogo1);
	    }
	    if (_bainaData.goodsDtlLogo2!==undefined && _bainaData.goodsDtlLogo2 !== '') {
	      _detailImgs.push(_bainaData.goodsDtlLogo2);
	    }
	    if (_bainaData.goodsDtlLogo3!==undefined && _bainaData.goodsDtlLogo3 !== '') {
	      _detailImgs.push(_bainaData.goodsDtlLogo3);
	    }
	    if (_bainaData.goodsDtlLogo4!==undefined && _bainaData.goodsDtlLogo4 !== '') {
	      _detailImgs.push(_bainaData.goodsDtlLogo4);
	    }
	    this.setState({
	    	bannerImgs:_bannerImgs,
	    	detailImgs:_detailImgs
	    });
	}
	showHelpModal(){//显示活动流程弹窗
	    var _this = this;
	    showConfirm(_this,'请选择您的小区',()=>{_this.props.history.push('/address')});
	}
	receive(){//申请白拿
		console.log("receive")
	    var _this = this;
	    getAjax({
	    	url:'bainaH5/preOrder',
	    	params:{
	    		loginId:_this.props.globalData.loginId,
			 	actId:_this.state.activityId,
			 	orderSrc:'7'
	    	},
	    	success(res){
	    		console.log("preOrder:",res);
	    		if(res.code === 200){
	    			_this.props.history.push('/result?tp=6&aid='+_this.state.act.actId);
		        }else if(res.code === 304){//其它未领取
		        	_this.props.history.push('/result?tp=1&aid='+_this.state.act.actId);
		        }else if(res.code === 307){//商品已领完
		        	_this.props.history.push('/result?tp=1&aid='+_this.state.act.actId);
		        }else{
		          	showConfirm(_this,res.desc);
		        }
	    	}
	    });
	}
	//开箱部分
	showOpenDoorHelp() {//显示开箱引导弹窗
	    this.setState({showOpenDoorHelpFlag:true});
	}
	hideOpenDoorHelp() {//隐藏开箱引导弹窗
	    this.setState({showOpenDoorHelpFlag:false});
	}
	scanCode() {//扫描二维码并开箱
	    this.hideOpenDoorHelp();//隐藏扫码引导弹窗
	    var _this = this;
	    window.registerDeviceready(function(){
	    	var hostAddr = _this.state.area.areaNm?_this.state.area.areaNm:'';
		    fuApp.startScanCode(function(data){
	          	console.log('startScanCode',data);
	          	if(data.rspCode === '0000'){
	          		_this.setState({
	          			showOpenDoorProgressFlag:true,
	          			precent:0
	          		});
	          		_this.showOpenDoorProgress();
	          		var _url = data.content;
	          		getAjax({
	          			url:'bainaH5/openBox',
	          			params:{
	          				loginId:_this.props.globalData.loginId,
							hostId:data.content,
							actId:_this.state.activityId
	          			},
	          			success(res){
	          				if (res.code === 200) {
	          					var _path = '/result?tp=3&aid='+_this.state.activityId;
	          					_path+='&no='+res.data.orderNo+'&box='+res.data.boxNo;
	          					_this.props.hostory.push(_path);
				            } else if (res.code === 500) {
				            	showConfirm(_this,res.desc,()=>{
									_this.props.history.push('/result?tp=4&aid='+_this.state.activityId);
				            	});
				            } else {
				            	_this.props.history.push('/result?tp=4&aid='+_this.state.activityId);
				            }
				            _this.setState({
								showOpenDoorProgressFlag:false,
								precent:0
				            });
      						clearInterval(_this.checkPhoneTimer);
	          			},
	          			fail(){
	          				_this.setState({
								showOpenDoorProgressFlag:false,
								precent:0
	          				});
	          				clearInterval(_this.checkPhoneTimer);
	          			}
	          		});
	          	}else{
	          		showConfirm(_this,'扫码失败');
	          	}
        	},function(){
        		console.log("扫码失败");
          		showConfirm(_this,'扫码失败');
        	},{
        		"hostAddr":hostAddr
        	});
        });
	}
	showOpenDoorProgress() {//设置开箱进度条进度
	    var _this = this;
	    this.setState({showOpenDoorProgressFlag:true});
	    _this.checkPhoneTimer = setInterval(function () {
	      	if (_this.state.precent >= 99) {
	        	clearInterval(_this.checkPhoneTimer);
	      	} else {
	        	_this.setState({precent: _this.state.precent + 1});
	      	}
	    }, 100);
	}
	jumpIndex(){//跳转到首页
		console.log("jumpIndex")
		this.props.history.push('/index');
	}
	jumpYz(mid){//点商品图片跳转到有赞页面
	    var _url = this.state.act.bainaGoods.goodsSellLink;
	    jumpH5Page(this,_url);
	}
	jumpYZPage(){//底部左边按钮点击跳转链接 
	    var _url = this.state.act.applySuccLink;
	    jumpH5Page(this,_url);
	}
	//跳转地址方面
	cancelDefaultAddress(){//取消默认地址，跳转地址选择页面
	    this.chooseAddress();
	}
	chooseAddress(){
		console.log("chooseAddress")
	    this.setState({showAddressModalFlag:false});
	    if (this.state.area.areaNo !== '' && this.state.area.areaNo !== undefined && this.state.area.cityCd !== '' && this.state.area.cityCd!==undefined) {
	    	var _path = '/address?cellCd='+this.state.area.areaNo;
	    	_path+='&cityName='+this.state.area.cityCd+'&cellNm='+this.state.area.areaNm;
	    	_path+='&hostId='+this.state.hostId;
	    	this.props.history.push(_path);
	    }else{
	    	this.props.history.push('/address');
	    }
	}
	checkEvent(){//点击底部按钮，确定事件
		var st = this.state.act.usrActSt;
	    if (st === 1){
	      	if (this.state.canReceiveFlag) {//可以领取
		        if (this.state.act.goodsNumLeft===0){
		          	showAlert({cont:"抱歉，您申请的活动已被领完!"});
		        }else{
		          	this.receive();
		        }
	      	}else{
	        	showAlert({cont:'活动还未开始，请耐心等待!'});
	      	}
	    } else if (st === 3) {
	      	this.showOpenDoorHelp();
	    }
	}
	activityCutDown(){//到活动开始时间的倒计时
	    var _this = this;
	    var _usrActSt = this.state.act.usrActSt;
	    var _cutDownTime = '';
	    var _time = '';
	    if (_usrActSt === 0) {//即将开始
	      	_time = _this.state.act.actStartTs;
	    } else if (_usrActSt === 1) {//进行中
	      	_time = _this.state.act.actEndTs
	    }
	    down();
	    function down() {
	      	clearTimeout(_this.activityTimer);
	      	var _diffTime = getDiffTime(_time);
	      	//console.log("diffTime:", _diffTime)
	      	if (_diffTime.day === 0 && _diffTime.hour === 0 && _diffTime.minute === 0 && _diffTime.second === 0) {
	        	//console.log("结束了");
	        	clearTimeout(_this.activityTimer);
		        _this.setState({
		        	actCutDownObj:{//活动倒计时信息
				        day: 0,
				        hour: 0,
				        minute: 0,
				        second: 0
				    }
				});
		        if (_usrActSt === 0) {//即将开始状态倒计时结束变为进行中状态
		          	var _act = _this.state.act;
		          	_act.usrActSt = 1;
		          	_this.setState({
		          		act:_act,
		          		canReceiveFlag:true
		          	});
		          	_this.activityCutDown();
		        } else if (_usrActSt === 1) {
		          	var _act = _this.state.act;
		          	_act.usrActSt = 5;
		          	_this.setState({
		          		canReceiveFlag:false,
		          		act:_act
		          	});
		        }
		        return;
		    } else {
		        _this.setState({
		        	actCutDownObj:{//活动倒计时信息
			            day: _diffTime.day,
			            hour: _diffTime.hour,
			            minute: _diffTime.minute,
			            second: _diffTime.second
			        }
			    });
		        _this.activityTimer = setTimeout(function(){
		          down();
		        },1000);
		    }
	    }
	}
	showActRuleModal() {
	    this.setState({showActRuleModalFlag:true});
	}
	hideActRuleModal() {
	    this.setState({showActRuleModalFlag:false});
	}
	cancel(){
		console.log("cancel");
	}
	confirm(){
		console.log("confirm");
	}
	createImgs(){
		var imgsDom = [];
		if(this.state.middleTabbarActiveIndex===1){
			this.state.detailImgs.map((item,index)=>{
				imgsDom.push(
					<img onClick={()=>{this.jumpYz('detail_'+index)}} key={index} src={this.state.imgPre+item} alt=""/>
				)
			});
		}
		return imgsDom;
	}
	createQuesItem(){
		// console.log("createQuesItem:",this.state.ques.answArr,typeof this.state.ques.answArr)
		var _quesItem = [];
		if(this.state.ques.answArr){
			this.state.ques.answArr.map((item,index) => {
				_quesItem.push(
					<span key={index} className={this.state.selectAnswIndex==index?'active answ_item':'answ_item'} onClick={()=>{this.selectAnsw(index)}} >{item}</span>
				)
			});
		}
		return _quesItem;
	}
	render(){
		return(
			<div className='container' v-if="!loadFailFlag">
				<div className='act_banner' >
			        <img onClick={()=>{this.jumpYz}} src={this.state.imgPre+this.state.bannerImgs[0]} className="slide-image"/>
			  	</div>
			  	<div className='activity_nums_left'>
				    <div className='activity_nums_left_top'>
				      <div className='activity_nums_precent_wrapper'>
				        <span className='activity_nums_precent' 
				        	style={{width:(this.state.act.goodsNum-this.state.act.goodsNumLeft)/this.state.act.goodsNum*100+'%'}}></span>
				      </div>
				      <span className='activity_nums_tip'>领完发货</span>
				    </div>
				    <div className='activity_nums_left_bottom'>剩余{this.state.act.goodsNumLeft?this.state.act.goodsNumLeft:0}份</div>
				</div>
				<div className='activity_name'>{this.state.act.actNm}</div>
				<div className='padding_10'></div>
					<div className='good_detail clearfix'>
					{
						this.state.actRecommandImg?<img onClick={()=>{this.jumpYz}} src={this.state.imgPre+this.state.actRecommandImg}/>:''
					}
					{
						this.createImgs()
					}
		  		</div>
		  		<div className='footer_padding'></div>
		  		<div className='footer'>
			    	<div onClick={()=>{this.jumpYZPage()}} className='footer_tabbar_item left'>{this.state.act.applySuccBt}</div>
			      	<div onClick={()=>{this.jumpIndex()}} className='footer_tabbar_item right'>更多白拿</div>
			      	{
			      		this.state.act.usrActSt == 0 ?
			      			<button onClick={()=>{this.checkEvent(this.state.act.usrActSt)}} className="footer_btn disabled">白拿</button>
			      		: this.state.act.usrActSt == 1 ?
			      			<button onClick={()=>{this.checkEvent(this.state.act.usrActSt)}} className="footer_btn">白拿</button>
			      		: this.state.act.usrActSt == 2?
			      		<button onClick={()=>{this.checkEvent(this.state.act.usrActSt)}} className='footer_btn disabled'>您已申请</button> 
						: this.state.act.usrActSt == 3 ?
						<button onClick={()=>{this.checkEvent(this.state.act.usrActSt)}} className='footer_btn'>扫码领取</button>
						: this.state.act.usrActSt == 4 || this.state.act.usrActSt == 5 ?
						<button onClick={()=>{this.checkEvent(this.state.act.usrActSt)}} className='footer_btn disabled'>申请结束</button>
						:''
			      	}
			  	</div>
			  	<div onClick={()=>{this.showActRuleModal}} className="act_rule">
				    <img src={require('./act_rule.png')} />
				</div>
				{
					this.state.showQuesModalFlag?
						<div onClick={()=>{this.hideQuesModal}} className='ques_wrapper'>
					  	<div onClick={()=>{this.preventD}} className='ques_cont clearfix'>
					    	<span className='ques_title'>{this.state.ques.question}</span>
						    <div className='answs clearfix'>
						      	{this.createQuesItem()}
						    </div>
						    {
						    	this.state.showTrueAnswFlag?
						    	<div className='answ_correct clearfix'>
								  	<span>您的回答不正确，请重新选择</span>
								  	<span>正确答案：{this.state.ques.answArr[this.state.ques.trueAnswer-1]}</span>
								</div>
								:''
						    }
						    <div className='ques_submit_btn'>
						      	<button onClick={()=>{this.submitAnsw()}} >提交</button>
						    </div>
					  	</div>
					</div>
					:''
				}
				
			</div>
		)
	}
}
/*


 */
const mapStateToProps = function(store){
	return{
		globalData:store.globalData
	}
}
export default connect(mapStateToProps)(Activity);