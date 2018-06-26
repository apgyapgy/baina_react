import React,{ Component } from 'react';
import {showConfirm,getParams,loadCordova,saveOperate,jumpH5Page,getDiffTime} from '../../js/public.js';
import {connect} from 'react-redux';
import store from '../../reducer/store.js';
import {setLoginId,setFrom,setLoaded} from '../../reducer/plan.js';
import fuApp from '../../js/libs/fuapp.js';
import './activity.css';
import ConfirmExampleConfirm from '../common/confirm.js';
class Activity extends Component{
	constructor(props){
		super(props);
		this.state = {
			activityId:'',//首页传过来的活动id
		    act:{},//活动信息
		    area:{},//地址信息
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
		    modalCont:'',//弹窗内容
		    showModal:false,//是否显示弹窗
		    showCancel:false,//是否显示取消按钮
		    confirmFn:null,//弹窗点确认按钮的执行函数
		    cancelFn:null,//弹窗点取消按钮的执行函数
		};
		this.initData = this.initData.bind(this);
	}
	checkPhoneTimer:null
	activityTimer:null
	componentDidMount(){
		var search = {};
		if(this.props.location.search){
			search = getParams(this.props.location.search);
		}
		var _this = this;
		if(search.aid){
			this.setState({
				acitivityId:search.aid
			});
			if(this.props.globalData.loginId == ''){
				loadCordova(this,this.initData);
			}else{
				this.initData();
			}
		}else{
			showConfirm(this,'非法页面参数',()=>{
				this.props.history.back();
			});
		}
		showConfirm(_this,'测试测试',()=>{
			console.log("aaa")
			_this.setState({showModal:false});
		},()=>{
			console.log("bbb");
			_this.setState({
				showModal:false
			});
		});
	}
	initData(){
		var _this = this;
		if(this.props.globalData.loginId == ''){
			fuApp.userInfo(function(userInfo){
				console.log("userInfo:",userInfo);
				if(userInfo.rspCode == '0000'){
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
		saveOperate(this, 'h5_活动页-活动id:'+this.activityId);
		var res = {
			"code":200,
			"data":{
				"act":{
					"actEndTs":"2018-07-02 00:00:00","actId":"1800000486",
					"actNm":"Mings铭氏挂耳咖啡免费试喝",
					"actOpenImg":"sys/o2o2/2018/06/25/o2oBainaActivity_473994786499353.jpg",
					"actOpenLink":"https://h5.youzan.com/v2/ump/promocard/fetch?alias=ylgs1oci",
					"actOpenUrl":"pages/usercenter/promotion/promotion_detail?type=promocard&id=2579035",
					"actSt":1,"actStartTs":"2018-06-25 16:00:00",
					"actWeight":986,"applyFailBt":"优惠购买",
					"applyFailLink":"https://h5.youzan.com/v2/goods/3et36u91t84co",
					"applyFailLogo":"sys/o2o2/2018/06/25/o2oBainaActivity_774732900799964.jpg",
					"applyFailUrl":"pages/goods/detail/index?alias=2xaddcdto14lk",
					"applySuccBt":"优惠购买","applySuccLink":"https://h5.youzan.com/v2/goods/3et36u91t84co",
					"applySuccLogo":"sys/o2o2/2018/06/25/o2oBainaActivity_172305935098804.jpg",
					"applySuccUrl":"pages/goods/detail/index?alias=2xaddcdto14lk",
					"bainaGoods":{
						"contact":"石俊","crtTs":"2018-06-21 19:10:35",
						"goodsActLogo1":"sys/o2o2/2018/06/21/o2oGoods_493176240435351.jpg",
						"goodsActLogo2":"sys/o2o2/2018/06/21/o2oGoods_194059897635283.jpg",
						"goodsActLogo3":"sys/o2o2/2018/06/21/o2oGoods_193706050834731.jpg",
						"goodsActLogo4":"sys/o2o2/2018/06/21/o2oGoods_177194367634893.jpg",
						"goodsAmt":3979,
						"goodsDtlLogo1":"sys/o2o2/2018/06/21/o2oGoods_888797816835623.jpg",
						"goodsDtlLogo2":"sys/o2o2/2018/06/21/o2oGoods_768195080735553.jpg",
						"goodsDtlLogo3":"sys/o2o2/2018/06/21/o2oGoods_191953110735486.jpg",
						"goodsDtlLogo4":"sys/o2o2/2018/06/21/o2oGoods_658059696535419.jpg",
						"goodsImgBig1":"","goodsImgBig2":"sys/o2o2/2018/06/21/o2oGoods_123397833635213.jpg",
						"goodsImgBig3":"sys/o2o2/2018/06/21/o2oGoods_383590878335144.jpg",
						"goodsImgLogo1":"sys/o2o2/2018/06/21/o2oGoods_118568423035046.jpg",
						"goodsImgLogo2":"sys/o2o2/2018/06/21/o2oGoods_174301211635081.jpg",
						"goodsImgLogo3":"sys/o2o2/2018/06/21/o2oGoods_173419112534961.jpg",
						"goodsNm":"Mings铭氏挂耳咖啡","goodsNo":"5200000037","goodsSale":0,
						"goodsSellLink":"https://h5.youzan.com/v2/goods/3et36u91t84co",
						"goodsSellUrl":"pages/goods/detail/index?alias=2xaddcdto14lk",
						"goodsTp":0,"id":51,"mchId":80000146,"mobile":"18516249201","operator":"",
						"updTs":"1900-01-01 00:00:00"},"broadSuccess":true,"code":200,
						"crtTs":"2018-06-25 15:55:00","deliveryNo":"70000008","desc":"成功",
						"goodsNo":"5200000037","goodsNum":40,"goodsNumLeft":35,"id":175,"mchId":"80000146",
						"onlineFlag":"上架","operator":"system","success":true,
						"updTs":"2018-06-26 11:48:42","usrActSt":"1","usrActStDesc":"进行中",
						"virtualApplyNum":0},"area":{"areaNm":"天安花园-2","areaNo":"A100014243",
						"cityCd":"2900","cityNm":"上海市"
					},
					"broadSuccess":true,"code":200,"desc":"成功",
					"success":true,
					"usr":{
						"appId":"wx5ad7257472438143","boundUser":false,
						"city":"","country":"","headImgUrl":"","id":61135,"latestHostId":"",
						"latestLat":"","latestLng":"","loginId":"13625625040",
						"needGetAgainUserInfo":true,"nickNm":"","offlineCode":"",
						"onlineCode":"","onlineCoupon":"","openId":"oUJ-84vffyRtURmS92NhRFxyBJf8",
						"province":"60262872","rewardAmt":0,"sex":0,"unionId":"",
						"userId":"","userNm":"","userSt":0,"userTp":0
					}
				},
				"desc":"成功",
				"success":true
		};
		if(res.code == 200){
			_this.setState({
				act : res.data.act,
				area : res.data.area,
				loadFailFlag : false,
				hostId : res.data.usr ? res.data.usr.province:'',
				hostId : res.data.usr ? res.data.usr.province:''
			});
	        _this.getActImgs();//处理返回的数据
	        _this.checkCutDown();//判断是否进行倒计时
	    } else if (res.code == 308){
          	if(_this.state.act != {}){
          		_this.setState({
          			loadFailFlag:true
          		});
          	}
	        showConfirm(_this,'很抱歉，您的附近暂无白拿活动，现在将为您跳转到白拿商城!',()=>{
	        	_this.props.hostory.push('/mall');
	        });
	    }else{
	        if(_this.act != {}) {
	            _this.setState({loadFailFlag:true});
	        }
	        if (res.desc != '请先注册用户并选择好配送终端。'){
	        	showConfirm(_this,res.desc);
	        }
	    }
  		/*getAjax({
			url:'bainaH5/toDetail',
			params:{
				loginId:_this.$store.state.loginId,
				actId:_this.activityId
			},
			success(res){
				console.log("toDetail:",res);
				if(res.code == 200){
		          	_this.act=res.data.act;
		            _this.area=res.data.area;
		            _this.loadFailFlag=false;
		            _this.hostId= res.data.usr ? res.data.usr.province:'';
			        _this.getActImgs();//处理返回的数据
			        _this.checkCutDown();//判断是否进行倒计时
			    } else if (res.code == 308){
		          	if(_this.act != {}){
		            	_this.loadFailFlag=true;
		          	}
		          	showAlert({
		        		cont:'很抱歉，您的附近暂无白拿活动，现在将为您跳转到白拿商城!',
		        		confirm(){
		        			_this.$router.push({
		        				path:'/mall'
		        			});
		        		}
		        	});
			    }else{
			        if(_this.act != {}) {
			            _this.loadFailFlag=true;
			        }
			        if (res.desc != '请先注册用户并选择好配送终端。'){
			            showAlert({cont:res.desc});
			        }
			    }
			}
		});*/
	}
	checkCutDown(){//判断是否进行倒计时
	    var _usrActSt = this.state.act.usrActSt;
	    if(_usrActSt == 0){//即将开始
	      this.activityCutDown();
	    }else if(_usrActSt==1){//进行中
	      this.setState({canReceiveFlag:true});
	      this.activityCutDown();
	    }else if(_usrActSt == 2){//配送中直接跳转到结果页面
	    }
	}
	changeMiddleTabbar(n){//中间商品详情与商品评价切换
	    this.setState({
	    	middleTabbarActiveIndex:n
	    });
	}
	getActImgs() {//获取活动图片
	    var _bainaData = this.state.act.bainaGoods;
	    var _bannerImgs = [], _detailImgs = [];
	    if (_bainaData.goodsActLogo1 && _bainaData.goodsActLogo1 != '') {
	      _bannerImgs.push(_bainaData.goodsActLogo1);
	    }
	    if (_bainaData.goodsActLogo2 && _bainaData.goodsActLogo2 != '') {
	      _bannerImgs.push(_bainaData.goodsActLogo2);
	    }
	    if (_bainaData.goodsActLogo3 && _bainaData.goodsActLogo3 != '') {
	      _bannerImgs.push(_bainaData.goodsActLogo3);
	    }
	    if (_bainaData.goodsActLogo4 && _bainaData.goodsActLogo4 != '') {
	      _bannerImgs.push(_bainaData.goodsActLogo4);
	    }
	    if (_bainaData.goodsDtlLogo1 && _bainaData.goodsDtlLogo1 != '') {
	      _detailImgs.push(_bainaData.goodsDtlLogo1);
	    }
	    if (_bainaData.goodsDtlLogo2 && _bainaData.goodsDtlLogo2 != '') {
	      _detailImgs.push(_bainaData.goodsDtlLogo2);
	    }
	    if (_bainaData.goodsDtlLogo3 && _bainaData.goodsDtlLogo3 != '') {
	      _detailImgs.push(_bainaData.goodsDtlLogo3);
	    }
	    if (_bainaData.goodsDtlLogo4 && _bainaData.goodsDtlLogo4 != '') {
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
	   /* getAjax({
	    	url:'bainaH5/preOrder',
	    	params:{
	    		loginId:_this.$store.state.loginId,
			 	actId:_this.activityId,
			 	orderSrc:'7'
	    	},
	    	success(res){
	    		console.log("preOrder:",res);
	    		if(res.code == 200){
	    			_this.props.history.push('/result?tp=6&aid='+_this.state.act.actId);
		        }else if(res.code == 304){//其它未领取
		        	_this.props.history.push('/result?tp=1&aid='+_this.state.act.actId);
		        }else if(res.code == 307){//商品已领完
		        	_this.props.history.push('/result?tp=1&aid='+_this.state.act.actId);
		        }else{
		          	showConfirm(_this,res.desc);
		        }
	    	}
	    });*/
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
	          	if(data.rspCode == '0000'){
	          		_this.setState({
	          			showOpenDoorProgressFlag:true,
	          			precent:0
	          		});
	          		_this.showOpenDoorProgress();
	          		var _url = data.content;
	          		/*getAjax({
	          			url:'bainaH5/openBox',
	          			params:{
	          				loginId:_this.$store.state.loginId,
								hostId:data.content,
								actId:_this.activityId
	          			},
	          			success(res){
	          				if (res.code == 200) {
	          					var _path = '/result?tp=3&aid='+_this.state.activityId;
	          					_path+='&no='+res.data.orderNo+'&box='+res.data.boxNo;
	          					_this.props.hostory.push(_path);
				            } else if (res.code == 500) {
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
	          		});*/
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
	    if (this.state.area.areaNo != '' && this.state.area.areaNo != undefined && this.state.area.cityCd != '' && this.state.area.cityCd!=undefined) {
	    	var _path = '/address?cellCd='+this.state.area.areaNo;
	    	_path+='&cityName='+this.state.area.cityCd+'&cellNm='+this.state.area.areaNm;
	    	_path+='&hostId='+this.state.hostId;
	    	this.props.history.push(_path);
	    }else{
	    	this.props.history.push('/address');
	    }
	}
	checkEvent(st){//点击底部按钮，确定事件
	    if (st == 1){
	      	if (this.state.canReceiveFlag) {//可以领取
		        if (this.state.act.goodsNumLeft==0){
		          	// showAlert({cont:"抱歉，您申请的活动已被领完!"});
		        }else{
		          	this.receive();
		        }
	      	}else{
	        	// showAlert({cont:'活动还未开始，请耐心等待。'});
	      	}
	    } else if (st == 3) {
	      	this.showOpenDoorHelp();
	    }
	}
	activityCutDown(){//到活动开始时间的倒计时
	    var _this = this;
	    var _usrActSt = this.state.act.usrActSt;
	    var _cutDownTime = '';
	    var _time = '';
	    if (_usrActSt == 0) {//即将开始
	      	_time = _this.state.act.actStartTs;
	    } else if (_usrActSt == 1) {//进行中
	      	_time = _this.state.act.actEndTs
	    }
	    down();
	    function down() {
	      	clearTimeout(_this.activityTimer);
	      	var _diffTime = getDiffTime(_time);
	      	//console.log("diffTime:", _diffTime)
	      	if (_diffTime.day == 0 && _diffTime.hour == 0 && _diffTime.minute == 0 && _diffTime.second == 0) {
	        	//console.log("结束了");
	        	clearTimeout(_this.activityTimer);
		        _this.setStat({
		        	actCutDownObj:{//活动倒计时信息
				        day: 0,
				        hour: 0,
				        minute: 0,
				        second: 0
				    }
				});
		        if (_usrActSt == 0) {//即将开始状态倒计时结束变为进行中状态
		          	var _act = _this.state.act;
		          	_act.usrActSt = 1;
		          	_this.setState({
		          		act:_act,
		          		canReceiveFlag:true
		          	});
		          	_this.activityCutDown();
		        } else if (_usrActSt == 1) {
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
	render(){
		return(
			<div>
			{
				this.state.showModal?
				<ConfirmExampleConfirm cont={this.state.modalCont} cancel={()=>{this.state.cancelFn()}} confirm={()=>{this.state.confirmFn()}} />
				:''
			}
			</div>
		)
	}
}
const mapStateToProps = function(store){
	return{
		globalData:store.globalData
	}
}
export default connect(mapStateToProps)(Activity);