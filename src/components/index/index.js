import React,{ Component } from 'react';
import {loadCordova,jumpH5Page,showAlert,getAjax} from '../../js/public.js';//,saveOperate
import {connect} from 'react-redux';
import store from '../../reducer/store.js';
import {setLoginId} from '../../reducer/plan.js';//,setFrom,setLoaded
import fuApp from '../../js/libs/fuapp.js';
// import { Button, Modal } from 'semantic-ui-react';

import './index.css';


function Header(props){//头部
	return(
		<div className='header'>
		  	<div onClick={props.chooseAddress} className='header_area'>
		    	<img className='header_area_img' src={require('./area_grey.png')} alt=""/>
		    	<span>{props.bindAddr.areaNm?props.bindAddr.areaNm:'选择小区'}</span>
		    	<img className='header_arrow_img' src={require('./solid_arrow.png')} alt=""/>
		  	</div> 
		  	<div className='user_icon_wrapper' onClick={props.toMyActs}>
		        <img className='user_icon' src={require('./user.png')} alt=""/>
		        {
		        	props.myNumbers>0?
		        	<span>{props.myNumbers}</span>
		        	:''
		        }
		        
		    </div>
		</div>
	)
}
//第一个活动
/*function Banner(props){//banner  v-if="bannerAct" props.bannerAct.actId,props.bannerAct.usrActSt
	return(
		<div className='banner_single'>
		  	<div onClick={props.cliBanner(1,2)}>
		      	<img className="slide-image" 
		      		src={props.imgPre+(props.bannerAct.usrActSt===4||props.bannerAct.usrActSt===5?props.bannerAct.bainaGoods.goodsImgBig2:props.bannerAct.bainaGoods.goodsImgBig3)} alt=""
		      	/>
		      	<img className="status_icon" src={require('./'+props.bannerAct.stUrl)} alt=""/>
		      	<span className='act_time'>申请时限：{props.bannerAct.actStartTs}-{props.bannerAct.actEndTs}</span>
		      	<span className='act_name'>{props.bannerAct.actNm}</span>
		      	<span className='act_num'>剩余{props.bannerAct.goodsNumLeft}份 共{props.bannerAct.virtualApplyNum}人申请</span>
		  	</div>
		</div>
	)
}*/
//活动列表
function Acts(props){
	// const cliBtn = (idx,actId,usrActSt)=>{
	// 	return ()=>{ props.cliBtn(idx,actId,usrActSt);}
	// }
	return(
		<div className='acts_n clearfix'>
			<div className='acts_n_title_wrapper'>
		      	<span className='left'></span>
		      	<img src={require('./heart_red.png')} alt=''/>
		      	<span className='acts_n_title'>先试后买 遇见好物</span>
		      	<span className='right'></span>
		    </div>
			{
				props.activityList.map((item,index) =>
					<div key={index} className='item act_n' onClick={()=>{props.cliBtn(index,item.actId,item.usrActSt)}}>
			        	<img className='act_n_good_img' src={''+props.imgPre+item.img} alt=''/> 
			          	{
			          		item.usrActSt===0||item.usrActSt===1||item.usrActSt===2||item.usrActSt===3?
			          		<img className='act_n_status' src={require('./'+item.stUrl)} alt=''/>
			          		:''
			          	}
			          	<img className='act_n_icon' src={require('./baina_icon.png')} alt=''/>
			          	<span className='act_n_name'>{item.actNm}</span>
			          	<div className='act_n_nums'>
			            	<span className='act_n_left'>{item.usrActSt===4||item.usrActSt===5?props.bindAddr.areaNm+'小区专属活动':'申请人数'+item.apply+'人'}</span>
			          	</div>
			          	{
			          		!(item.usrActSt===5)?
			          		<div className='act_n_nums_left'>
				            	<span className='left'>剩余</span>
				            	<span className='right'>{item.goodsNumLeft}份</span>
				          	</div>:''
			          	}
			        </div>
		      	)
		    }
		</div>
	)
}
//白拿优品
function BnypList(props){
	const bnypJumpYz = (idx,goodsNo,address)=>{
		return ()=>{ props.bnypJumpYz(idx,goodsNo,address);}
	}
	return(
		<div className='bnyp_wrapper clearfix'>
			<div className='acts_n_title_wrapper orange'>
		      	<span className='left'></span>
		      	<img src={require('./heart_orange.png')} alt='' />
		      	<span className='acts_n_title'>为您推荐</span>
		      	<span className='right'></span>
		    </div>
			<div className='bnyp_goods clearfix'>
		    {
		    	props.bnypList.map((item,index) => 
			      	<div className='bnyp_good clearfix' key={index} onClick={bnypJumpYz(index,item.goodsNo,item.linkAddress)}>
			         	<img className='bnyp_img' src={props.imgPre+item.goodsImgSmall} alt=''/> 
			        	<div className='bnyp_good_name clearfix'>{item.goodsNm}</div>
			        	<div className='bnyp_good_price'>售价:<span>￥{item.discountAmt}</span></div>
			        	<span className='bnyp_good_origin_price'>{item.goodsSellNum}人购买</span>
			        	<img className='bnyp_icon' src={require('./bnyp_icon.png')} alt='' />
			      	</div>
		    	)
		    }
		    </div>
		</div>
	)
}
class Index extends Component{
	constructor(props){
		super(props);
		this.state = {
			bannerAct: null,
		    activityList:[],//   status:0,//0进行中 1即将开始 2已参与 3已结束
		    bnypList:[],//白拿优品们
		    recommendGood:{},//推荐商品信息
		    showAddressModalFlag: false,//是否显示温馨提示弹窗
		    clickable: true,
		    imgPre:this.props.globalData.imgPre,
		    defaultAddr: {//用户收件宝默认地址
		      cellNm:'',
		      hostAddr: '',
		      hostId: '',
		      cellCd:'',
		      cityCd:'',
		      cityNm:''
		    },
		    bindAddr: {//用户绑定的终端信息
		      cellCd:'',//小区code
		      areaNm: '',//小区地址
		      cityCd: '',//	城市 code
		      cityNm: '',//	城市名称
		      hostId: '',//	终端号
		      hostAddr: '' //	终端地址
		    },
		    loadFailFlag:false,//是否加载失败
		    loadFlag:false,//是否请求数据，用于头部地址框在请求前隐藏
		    showChooseAddressIconFlag:false,//是否在请求数据
		    loginId:'',
		    from:'',
    		showRecommendFlag:false,//是否显示优选商品推荐
    		//下拉刷新
    		topStatus:'',
    		myNumbers:0,//用户活动数量
		}
		this.initData = this.initData.bind(this);
		this.getActs = this.getActs.bind(this);
	}
	componentWillMount(){
		if(this.props.globalData.loginId === ''){
			loadCordova(this,this.initData);
		}else{
			this.initData();
		}
	}
	componentDidMount(){
	}
	initData(){
		// showAlert({
		// 	cont:'哈哈哈哈',
		// 	confirm(){
		// 		console.log("confirm")
		// 	},
		// 	cancel(){
		// 		console.log("cancel")
		// 	}
		// });
		var _this = this;
		if(_this.props.globalData.loginId === ''){
			fuApp.userInfo(function(userInfo){
				console.log("userInfo:",userInfo);
				if(userInfo.rspCode === '0000'){
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
		console.log("getActs")
		var _this = this;
		getAjax({
			url:'bainaH5/qryIndex',
			params:{
				loginId:_this.props.globalData.loginId,
				type:1
			},
			success(res){
				console.log('qryIndex:',res);
				if(res.code === 200){
		            var _actList = res.data.acts;
		            // var _flag = false;//判断是否取过推荐商品
		    		var _recommend = {};
		            for(var k in _actList){
		              	var _st = _actList[k].usrActSt;
		              	var _stUrl;
		              	//st:0即将开始,1进行中,2待配送,3已配送,4已领取,5已结束
		              	_stUrl = _st === 0 ? 'wait' : _st === 2 ? 'rece' : _st === 3 ? 'send' : _st===1?'in':_st===4?'ended':'send';
						_stUrl = 'corner_' + _stUrl + '.png';
		              	_actList[k].actEndTs = _actList[k].actEndTs.substring(0,10).replace(/-/g,'.');
		              	_actList[k].actStartTs = _actList[k].actStartTs.substring(0, 10).replace(/-/g, '.');
		             	_actList[k].stUrl = _stUrl;
		              	var _apply = _actList[k].goodsNum - _actList[k].goodsNumLeft;
		              	_actList[k].apply = _apply > 10000 ? parseInt(_apply / 1000) / 10 + '万':_apply;
		              	if(_actList[k].goodsNum>10000){
		                	_actList[k].goodsNum = parseInt(_actList[k].goodsNum/1000)/10+'万';
		              	}
		              	if (_actList[k].goodsNumLeft > 10000) {
		                	_actList[k].goodsNumLeft = parseInt(_actList[k].goodsNumLeft / 1000) / 10 + '万';
		              	}
		              	if(_st===0||_st===1||_st===2||_st===3){
		              		_actList[k].img =_actList[k].bainaGoods.goodsImgBig3;
		              	}else{
		              		_actList[k].img = _actList[k].bainaGoods.goodsImgBig2;
		              	}
		            }
		            var bindAddr =  {//用户绑定的终端信息
		              	cellCd: res.data.cellCd ? res.data.cellCd:'',
		              	areaNm: res.data.areaNm ? res.data.areaNm:'',
		              	cityCd: res.data.cityCd ? res.data.cityCd:'',
		              	cityNm: res.data.cityNm ? res.data.cityNm:'',
		              	hostId: res.data.hostId ? res.data.hostId:'',
		              	hostAddr: res.data.hostAddr ? res.data.hostAddr:''
		            };
		            _this.setState({
		            	activityList:_actList,
		            	bannerAct:res.data.banners?res.data.banners:[],
		            	phoneBinded:true,
		            	loadFailFlag:false,
		            	bindAddr:bindAddr,
		            	recommendGood:_recommend,
		            	bnypList:[],
		            	myNumbers:res.data.myNumbers?res.data.myNumbers:0
		            });
			    }else if(res.code === 101){//用户未成为会员
		          	// _this.showHelpFlag = true;
		          	_this.setState({phoneBinded:false});
		        }else if(res.code === 102){//未绑定终端跳转到选择地址页面
		        	_this.setState({
		        		phoneBinded:true,
		        		showActRuleModalFlag:false
		        	});
		        	var _path = '/address';
			      	_this.props.history.push(_path);
		        }else{
		          	//加载失败且第一次加载没数据显示页面打开失败
		          	if(!_this.state.activityList.length){
		            	_this.setState({loadFailFlag:true});
		          	}
		          	// showAlert({
		          	// 	cont:res.data.desc
		          	// });
		        }
		        _this.loadFlag = true;
		        // _this.$refs.loadmore.onTopLoaded();
				_this.getBnypList();
		        _this.setState({loadFlag:true});
		        // _this.$refs.loadmore.onTopLoaded();
			}
		});
	}
	getBnypList(){//获取白拿优品列表
	    var _this = this;
	    console.log("getBnypList")
	    getAjax({
			url:'baina/qryIndexShop',
			params:{
				loginId:_this.props.globalData.loginId,
				type:1
			},
			success(res){
				console.log("qryIndexShop:",res);
				if(res.code === 200){
		          	var _bnypList = _this.state.bnypList;
		          	if(res.data.list.length){
		            	var _list = res.data.list ? res.data.list:[];
		            	for (var k in _list){
		              		if (_list[k].goodsSale === 0 || _list[k].goodsSale===100){
		                		_list[k].discountAmt = (_list[k].goodsPrice/100).toFixed(2);
		              		}else{
		                		var _price = _list[k].goodsPrice * _list[k].goodsSale/100;
		                		_list[k].discountAmt = (_price / 100).toFixed(2);
		              		}
		            	}
		            	_bnypList = _bnypList.concat(_list);
		            	_this.setState({
		            		bnypList:_bnypList,
		            		totalPage:Math.ceil(res.data.totalNm/res.data.pageSize)
		            	});
		          	}
		        }else{
		        	showAlert({
						cont:res.desc
					});
		        }
			}
		});
	}
	cliBtn(idx,actId,actSt){
		console.log("cliBtn:",idx,actId,actSt);
		//st:0即将开始,1进行中,2待配送,3已配送,4已领取,5已结束
	    //1立即申请;0 2去看看;3扫码开箱;4 5商品抢购
	    // var _st = actSt;//用户参与活动的状态
	    var _aid = actId;//活动id
	    // var _idx = idx;//点第几个
	    var _path = '/activity?aid='+_aid;
	    this.props.history.push(_path);
	    //按钮为"去看看","立即申请",'扫码开箱'跳转活动页面
	    /*
		    if (_st === 0 || _st === 1 || _st === 3){
		    	var _path = '/activity?aid='+_aid;
		    	this.props.history.push(_path);
		    }else if(_st === 2){//待配送,跳结果页
		      	var _aid = this.state.activityList[_idx].actId;
		      	var _url = this.state.activityList[_idx].applySuccUrl;
		      	var _path = '/result?aid='+_aid+'&tp=5';
		      	this.props.history.push(_path);
		    }else if(_st===4||_st===5){//已结束和已领取，跳有赞页面
		    	var _url = this.state.activityList[_idx].bainaGoods.goodsSellLink;
		      	jumpH5Page(this,_url);
		    }
	    */
	}
	cliBanner(actId,actSt){//点击banner活动
	    //st:0即将开始,1进行中,2待配送,3已配送,4已领取,5已结束
	    //1立即申请;0 2去看看;3扫码开箱;4 5商品抢购
	    var _st = actSt;//用户参与活动的状态
	    var _aid = actId;//活动id
	    //按钮为"去看看","立即申请",'扫码开箱'跳转活动页面
	    if (_st === 0 || _st === 1 || _st === 3) {
	    	this.props.history.push('/activity?aid='+_aid);
	    } else if (_st === 2) {//待配送,跳结果页
	    	this.props.history.push('/result?tp=5&aid='+_aid);
	    } else if (_st === 4 || _st === 5) {//已结束和已领取，跳有赞页面
	      	var _url = this.state.bannerAct.bainaGoods.goodsSellLink;
	      	jumpH5Page(this,_url);
	    }
	}
	callback(msg){
        console.log("msg:",msg);
    }
    bnypJumpYz(idx){//白拿优品跳转有赞
		var _url = this.state.bnypList[idx].linkAddress;
		// var _aid = this.state.bnypList[idx].goodsNo;
	    jumpH5Page(this,_url);
	}
    createBnyp(){//创建白拿优品
    	const bnypList = [];
    	this.state.bnypList.map((item,index)=>{
    		bnypList.push(
    			<div className='bnyp_good clearfix' key={index} onClick={()=>{this.bnypJumpYz(index)}} >
			      	<div className='bnyp_left clearfix'>
				        <div className='bnyp_good_name clearfix'>
				        	{
				        		item.goodsSale!==0&&item.goodsSale!==100?
				        		<span className='bnyp_good_discount'>{item.goodsSale/10}折</span>:''
				        	}
				          	<span className='bnyp_good_name_1'>{item.goodsNm}</span>
				        </div>
				        <div className='bnyp_good_nums'>
			          		<span className='bnyp_good_price'>售价：<b>￥{item.discountAmt}</b></span>
			          		{
			          			item.goodsSale!==0&&item.goodsSale!==100?
			          			<span className='bnyp_good_origin_price'>￥{item.goodsAmt}</span>
			          			:''
			          		}
			        	</div>
			      	</div>
			      	<img className='bnyp_img' alt='' src={this.state.imgPre+item.goodsImgSmall} alt=""/>
			    </div>		
    		)
    	})
    	return bnypList;
    }
    chooseAddress(){//跳转到选择地址页面
	    //this.setData({ showAddressModalFlag:false});
	    if (this.state.bindAddr.cellCd !== '' && this.state.bindAddr.cellCd !== undefined && this.state.bindAddr.cityCd !== '' && this.state.bindAddr.cityCd !== undefined) {
	      	var _path = '/address?cellCd='+this.state.bindAddr.cellCd+'&cityName='+this.state.bindAddr.cityNm;
	      	_path+='&cityCd='+this.state.bindAddr.cityCd+'&cellNm='+this.state.bindAddr.areaNm+'&hostId='+this.state.bindAddr.hostId;
	      	this.props.history.push(_path);
	    }else{
	    	this.props.history.push('/address');
	    }
	}
	toMyActs(){//跳转到我的白拿页面
    	this.props.history.push('/myActs');
    }
    showHelpModal() {//显示帮助弹窗
		var _this = this;
		showAlert({
			title:'温馨提示',
			cont:'请选择您的小区',
			confirm(){
				_this.props.history.push('/address');
			}
		});
	}
	closeHelpModal(){
		this.setState({showHelpFlag : false});
	}
	closeRecommendModal(){//关闭优选商品推荐
    	this.setState({showRecommendFlag:false});
	    this.changeRecommendFlag();
	}
	toRecommendGood(e){//点击推荐商品领券按钮
  		this.setState({showRecommendFlag:false});
	    this.changeRecommendFlag();//修改弹窗状态，下次不显示
	    var _url = this.state.recommendGood.actOpenUrl;
	    jumpH5Page(this,_url);
  	}
  	changeRecommendFlag(){//点击关闭或领券修改弹窗状态
	    var _this  = this;
	    getAjax({
	    	url:'bainaH5/updatePopRecord',
	    	params:{
	    		loginId:_this.props.globalData.loginId,
	    		orderNo:_this.state.recommendGood.orderNo
	    	},
	    	notShowLoading:true,
	    	success(res){
	    		console.log("updatePopRecord");
	    		if(res.code === 200){
	    		}else{
	    			showAlert({cont:res.desc});
	    		}
	    	}
	    });
	}
	render(){
		return (
			<div>
				<Header bindAddr={this.state.bindAddr} chooseAddress={this.chooseAddress.bind(this)} myNumbers={this.state.myNumbers}/>
				{
					this.state.activityList.length?
						<Acts imgPre={this.state.imgPre} 
							  activityList={this.state.activityList} 
							  cliBtn={this.cliBtn.bind(this)}
							  bindAddr={this.state.bindAddr}
					    />:''
				}
				{
					this.state.bnypList.length>0?
					<BnypList bnypList={this.state.bnypList}
							  imgPre={this.state.imgPre}
					/>
					:''
				}
				
			</div>
		)
	}
}

//
// 	{this.state.bannerAct?
// 	<Banner imgPre={this.state.imgPre} bannerAct={this.state.bannerAct} cliBanner={()=>{this.cliBanner}} />
// 	:''
// }*/

// /*{
// 	this.state.bnypList.length?
// 	<div className='bnyp_wrapper clearfix'>
// 		<div className='bnyp_head'>
// 			<img src={require('./bnyp.png')} alt=''/>
// 		</div>
// 		<div className='bnyp_goods clearfix'>
// 			{this.createBnyp()}
// 		</div>
// 	</div>:''
// }*/


const mapStateToProps = function(store){
	return{
		globalData:store.globalData
	}
}
export default connect(mapStateToProps)(Index);