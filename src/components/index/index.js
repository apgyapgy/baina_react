import React,{ Component } from 'react';
import {showConfirm,loadCordova} from '../../js/public.js';
import {connect} from 'react-redux';
import store from '../../reducer/store.js';
import {setLoginId,setFrom,setLoaded} from '../../reducer/plan.js';
import fuApp from '../../js/libs/fuapp.js';

import './index.css';

function Header(props){//头部
	return(
		<div className='header'>
		  	<div onClick={props.chooseAddress} className='header_area'>
		    	<img className='header_area_img' src={require('./area_grey.png')}></img>
		    	<span>{props.bindAddr.areaNm?props.bindAddr.areaNm:'选择小区'}</span>
		    	<img className='header_arrow_img' src={require('./solid_arrow.png')} ></img>
		  	</div> 
		  	<div className='user_icon_wrapper' onClick={props.toMyActs}>
		        <img className='user_icon' src={require('./user.png')} />
		    </div>
		</div>
	)
}
//+ (?)
function Banner(props){//banner  v-if="bannerAct" props.bannerAct.actId,props.bannerAct.usrActSt
	return(
		<div className='banner_single'>
		  	<div onClick={props.cliBanner(1,2)}>
		      	<img className="slide-image" 
		      		src={props.imgPre+(props.bannerAct.usrActSt==4||props.bannerAct.usrActSt==5?props.bannerAct.bainaGoods.goodsImgBig2:props.bannerAct.bainaGoods.goodsImgBig3)}
		      	/>
		      	<img className="status_icon" src={require('./'+props.bannerAct.stUrl)}></img>
		      	<span className='act_time'>申请时限：{props.bannerAct.actStartTs}-{props.bannerAct.actEndTs}</span>
		      	<span className='act_name'>{props.bannerAct.actNm}</span>
		      	<span className='act_num'>剩余{props.bannerAct.goodsNumLeft}份 共{props.bannerAct.virtualApplyNum}人申请</span>
		  	</div>
		</div>
	)
}
function Acts(props){//活动列表
	return(
		<div className='acts clearfix'>
			{
				props.activityList.map((item,index) =>
			        <div className='act' key={index} onClick={props.cliBtn(index,item.actId,item.usrActSt)}>
			        	<img className='act_good_img' src={props.imgPre+(item.usrActSt==4||item.usrActSt==5?item.bainaGoods.goodsImgLogo2:item.bainaGoods.goodsImgLogo3)}/>
			        	<img className='act_status' src={require('./'+item.stUrl)} />

			        	<span className='act_name'>{item.actNm}</span>
					    <div className='act_nums'>
					        <span className='act_left'>剩余{item.goodsNumLeft}份</span>
					        <span className='act_apply_nums'>{item.virtualApplyNum}人申请</span>
					    </div>
			        </div>
		      	)
		    }
		</div>
	)
	/*
	
	<div className='acts clearfix'>
	  <div className='act' v-for="(item,idx) in activityList" @click="cliBtn(idx,item.actId,item.usrActSt)">
	      <img className='act_good_img' :src="item.usrActSt==4||item.usrActSt==5?imgPre+item.bainaGoods.goodsImgLogo2: imgPre+item.bainaGoods.goodsImgLogo3"/>
	      <img className='act_status' :src="'./static/images/'+item.stUrl"/>
	      <span className='act_name'>{item.actNm}</span>
	      <div className='act_nums'>
	        <span className='act_left'>剩余{{item.goodsNumLeft}}份</span>
	        <span className='act_apply_nums'>{item.virtualApplyNum}人申请</span>
	      </div>
	  </div>
	</div>
	*/
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
    		topStatus:''
		}
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
		console.log("getActs")
		var _this = this;
		var res = {
			"code":200,
			"data":{
				"acts":[
					{
						"actEndTs":"2018-06-25 00:00:00",
						"actId":"1800000464",
						"actNm":"老管家洗衣机槽清洁剂免费试用",
						"actOpenImg":"sys/o2o2/2018/06/19/o2oBainaActivity_208956668005060.jpg",
						"actOpenLink":"https://h5.youzan.com/v2/ump/promocard/fetch?alias=3dhohvhj",
						"actOpenUrl":"pages/usercenter/promotion/promotion_detail?type=promocard&id=2566572",
						"actSt":1,"actStartTs":"2018-06-19 14:37:01","actWeight":984,
						"applyFailBt":"优惠购买",
						"applyFailLink":"https://h5.youzan.com/v2/goods/2fmrwxfdovuqw",
						"applyFailLogo":"sys/o2o2/2018/06/19/o2oBainaActivity_181241011805296.jpg",
						"applyFailUrl":"pages/goods/detail/index?alias=2fmrwxfdovuqw",
						"applySuccBt":"优惠购买",
						"applySuccLink":"https://h5.youzan.com/v2/goods/2fmrwxfdovuqw",
						"applySuccLogo":"sys/o2o2/2018/06/19/o2oBainaActivity_201172288604948.jpg",
						"applySuccUrl":"pages/goods/detail/index?alias=2fmrwxfdovuqw",
						"bainaGoods":{
							"contact":"石俊","crtTs":"2018-06-15 15:20:43",
							"goodsActLogo1":"sys/o2o2/2018/06/15/o2oGoods_512694572542578.jpg",
							"goodsActLogo2":"sys/o2o2/2018/06/15/o2oGoods_510851195542511.jpg",
							"goodsActLogo3":"sys/o2o2/2018/06/15/o2oGoods_210433221942061.jpg",
							"goodsActLogo4":"sys/o2o2/2018/06/15/o2oGoods_140040300542152.jpg",
							"goodsAmt":2560,
							"goodsDtlLogo1":"sys/o2o2/2018/06/15/o2oGoods_102014068442948.jpg",
							"goodsDtlLogo2":"sys/o2o2/2018/06/15/o2oGoods_201147189142833.jpg",
							"goodsDtlLogo3":"sys/o2o2/2018/06/15/o2oGoods_316060415342760.jpg",
							"goodsDtlLogo4":"sys/o2o2/2018/06/15/o2oGoods_202631011642685.jpg",
							"goodsImgBig1":"",
							"goodsImgBig2":"sys/o2o2/2018/06/15/o2oGoods_854944771842449.jpg",
							"goodsImgBig3":"sys/o2o2/2018/06/15/o2oGoods_191516463142386.jpg",
							"goodsImgLogo1":"sys/o2o2/2018/06/15/o2oGoods_485077542442286.jpg",
							"goodsImgLogo2":"sys/o2o2/2018/06/15/o2oGoods_715077409742350.jpg",
							"goodsImgLogo3":"sys/o2o2/2018/06/15/o2oGoods_115075206142223.jpg",
							"goodsNm":"老管家洗衣槽清洁剂","goodsNo":"5200000035","goodsSale":90,
							"goodsSellLink":"https://h5.youzan.com/v2/goods/2fmrwxfdovuqw",
							"goodsSellUrl":"pages/goods/detail/index?alias=2fmrwxfdovuqw",
							"goodsTp":0,"id":47,"mchId":80000140,"mobile":"18516249201",
							"operator":"","updTs":"1900-01-01 00:00:00"
						},
						"broadSuccess":true,"code":200,"crtTs":"2018-06-19 14:50:05",
						"deliveryNo":"70000008","desc":"成功","goodsNo":"5200000035",
						"goodsNum":40,"goodsNumLeft":10,"id":159,"mchId":"80000140",
						"onlineFlag":"上架","operator":"system","success":true,
						"updTs":"2018-06-22 15:05:31","usrActSt":"1","usrActStDesc":"进行中",
						"virtualApplyNum":30
					},{
						"actEndTs":"2018-06-25 00:00:00","actId":"1800000466",
						"actNm":"免水洗手液免费试用",
						"actOpenImg":"sys/o2o2/2018/06/19/o2oBainaActivity_205336051035340.jpg",
						"actOpenLink":"https://h5.youzan.com/v2/ump/promocard/fetch?alias=2zfupfr9",
						"actOpenUrl":"pages/usercenter/promotion/promotion_detail?type=promocard&id=2566587",
						"actSt":1,"actStartTs":"2018-06-19 14:42:54",
						"actWeight":985,"applyFailBt":"优惠购买",
						"applyFailLink":"https://h5.youzan.com/v2/goods/272udqv8md0eg",
						"applyFailLogo":"sys/o2o2/2018/06/19/o2oBainaActivity_146585237235717.jpg",
						"applyFailUrl":"pages/goods/detail/index?alias=272udqv8md0eg",
						"applySuccBt":"优惠购买",
						"applySuccLink":"https://h5.youzan.com/v2/goods/272udqv8md0eg",
						"applySuccLogo":"sys/o2o2/2018/06/19/o2oBainaActivity_209183452535220.jpg",
						"applySuccUrl":"pages/goods/detail/index?alias=272udqv8md0eg",
						"bainaGoods":{
							"contact":"金晨","crtTs":"2018-06-15 15:23:16",
							"goodsActLogo1":"sys/o2o2/2018/06/15/o2oGoods_197327565196219.jpg",
							"goodsActLogo2":"sys/o2o2/2018/06/15/o2oGoods_736815233796151.jpg",
							"goodsActLogo3":"sys/o2o2/2018/06/15/o2oGoods_132178651895694.jpg",
							"goodsActLogo4":"sys/o2o2/2018/06/15/o2oGoods_175880730595799.jpg",
							"goodsAmt":1800,
							"goodsDtlLogo1":"sys/o2o2/2018/06/15/o2oGoods_885139388896479.jpg",
							"goodsDtlLogo2":"sys/o2o2/2018/06/15/o2oGoods_523316236596413.jpg",
							"goodsDtlLogo3":"sys/o2o2/2018/06/15/o2oGoods_152302791896349.jpg",
							"goodsDtlLogo4":"sys/o2o2/2018/06/15/o2oGoods_130765054696282.jpg",
							"goodsImgBig1":"",
							"goodsImgBig2":"sys/o2o2/2018/06/15/o2oGoods_120900977396088.jpg",
							"goodsImgBig3":"sys/o2o2/2018/06/15/o2oGoods_188614615796021.jpg",
							"goodsImgLogo1":"sys/o2o2/2018/06/15/o2oGoods_770502635795925.jpg",
							"goodsImgLogo2":"sys/o2o2/2018/06/15/o2oGoods_155850537995960.jpg",
							"goodsImgLogo3":"sys/o2o2/2018/06/15/o2oGoods_125774584795861.jpg",
							"goodsNm":"免水洗手液","goodsNo":"5200000036","goodsSale":90,
							"goodsSellLink":"https://h5.youzan.com/v2/goods/272udqv8md0eg",
							"goodsSellUrl":"pages/goods/detail/index?alias=272udqv8md0eg",
							"goodsTp":0,"id":49,"mchId":80000143,"mobile":"15056196065",
							"operator":"","updTs":"1900-01-01 00:00:00"
						},
						"broadSuccess":true,"code":200,"crtTs":"2018-06-19 14:55:35",
						"deliveryNo":"70000008","desc":"成功","goodsNo":"5200000036",
						"goodsNum":35,"goodsNumLeft":24,"id":161,"mchId":"80000143",
						"onlineFlag":"上架","operator":"system","success":true,
						"updTs":"2018-06-22 15:07:06","usrActSt":"1","usrActStDesc":"进行中",
						"virtualApplyNum":11
					},{
						"actEndTs":"2018-06-19 00:00:00","actId":"1800000376",
						"actNm":"安蓓美厨房纸巾免费试用",
						"actOpenImg":"sys/o2o2/2018/06/11/o2oBainaActivity_186027462514872.jpg",
						"actOpenLink":"https://h5.youzan.com/v2/ump/promocard/fetch?alias=mluvoor3",
						"actOpenUrl":"pages/usercenter/promotion/promotion_detail?type=promocard&id=2546613",
						"actSt":2,"actStartTs":"2018-06-11 15:44:10","actWeight":986,
						"applyFailBt":"优惠购买",
						"applyFailLink":"https://h5.youzan.com/v2/goods/2xj1ih65rners",
						"applyFailLogo":"sys/o2o2/2018/06/11/o2oBainaActivity_184502320015015.jpg",
						"applyFailUrl":"pages/goods/detail/index?alias=2xj1ih65rners",
						"applySuccBt":"优惠购买",
						"applySuccLink":"https://h5.youzan.com/v2/goods/2xj1ih65rners",
						"applySuccLogo":"sys/o2o2/2018/06/11/o2oBainaActivity_171942833114792.jpg",
						"applySuccUrl":"pages/goods/detail/index?alias=2xj1ih65rners",
						"bainaGoods":{
							"contact":"唐珍珍","crtTs":"2018-06-08 14:26:32",
							"goodsActLogo1":"sys/o2o2/2018/06/08/o2oGoods_161493562692419.jpg",
							"goodsActLogo2":"sys/o2o2/2018/06/08/o2oGoods_169401224992353.jpg",
							"goodsActLogo3":"sys/o2o2/2018/06/08/o2oGoods_168788397691673.jpg",
							"goodsActLogo4":"sys/o2o2/2018/06/08/o2oGoods_380373676391943.jpg",
							"goodsAmt":4500,
							"goodsDtlLogo1":"sys/o2o2/2018/06/08/o2oGoods_477059440492689.jpg",
							"goodsDtlLogo2":"sys/o2o2/2018/06/08/o2oGoods_311780971392622.jpg",
							"goodsDtlLogo3":"sys/o2o2/2018/06/08/o2oGoods_296050852992556.jpg",
							"goodsDtlLogo4":"sys/o2o2/2018/06/08/o2oGoods_212381820392488.jpg",
							"goodsImgBig1":"",
							"goodsImgBig2":"sys/o2o2/2018/06/08/o2oGoods_168172305138044.jpg",
							"goodsImgBig3":"sys/o2o2/2018/06/08/o2oGoods_994111049938023.jpg",
							"goodsImgLogo1":"sys/o2o2/2018/06/08/o2oGoods_132754694037983.jpg",
							"goodsImgLogo2":"sys/o2o2/2018/06/08/o2oGoods_766163132737999.jpg",
							"goodsImgLogo3":"sys/o2o2/2018/06/08/o2oGoods_191379689237935.jpg",
							"goodsNm":"安蓓美厨房纸巾","goodsNo":"5200000033","goodsSale":90,
							"goodsSellLink":"https://h5.youzan.com/v2/goods/2xj1ih65rners",
							"goodsSellUrl":"pages/goods/detail/index?alias=2xj1ih65rners",
							"goodsTp":0,"id":45,"mchId":80000127,"mobile":"15902131755",
							"operator":"","updTs":"2018-06-14 15:05:16"
						},
						"broadSuccess":true,"code":200,"crtTs":"2018-06-11 15:56:55",
						"deliveryNo":"70000008","desc":"成功","goodsNo":"5200000033",
						"goodsNum":30,"goodsNumLeft":0,"id":145,"mchId":"80000127",
						"onlineFlag":"上架","operator":"system","success":true,
						"updTs":"2018-06-22 15:05:00","usrActSt":"5","usrActStDesc":"已结束",
						"virtualApplyNum":30
					},{
						"actEndTs":"2018-06-19 00:00:00","actId":"1800000378",
						"actNm":"女神1号混合果蔬片免费试吃",
						"actOpenImg":"sys/o2o2/2018/06/11/o2oBainaActivity_115877942973563.jpg",
						"actOpenLink":"https://h5.youzan.com/v2/ump/promocard/fetch?alias=1dcitpeo3",
						"actSt":2,"actStartTs":"2018-06-11 15:47:08","actWeight":987,
						"applyFailBt":"优惠购买",
						"applyFailLink":"https://h5.youzan.com/v2/goods/3ne98w78fzyp4",
						"applyFailLogo":"sys/o2o2/2018/06/11/o2oBainaActivity_175406565273560.jpg",
						"applyFailUrl":"pages/goods/detail/index?alias=3ne98w78fzyp4",
						"applySuccBt":"优惠购买",
						"applySuccLink":"https://h5.youzan.com/v2/goods/3ne98w78fzyp4",
						"applySuccLogo":"sys/o2o2/2018/06/11/o2oBainaActivity_174865415573251.jpg",
						"applySuccUrl":"pages/goods/detail/index?alias=3ne98w78fzyp4",
						"bainaGoods":{
							"contact":"金晨","crtTs":"2018-06-08 11:47:05",
							"goodsActLogo1":"sys/o2o2/2018/06/08/o2oGoods_189058698525142.jpg",
							"goodsActLogo2":"sys/o2o2/2018/06/08/o2oGoods_163808308725082.jpg",
							"goodsActLogo3":"sys/o2o2/2018/06/08/o2oGoods_133127136924680.jpg",
							"goodsActLogo4":"","goodsAmt":2400,
							"goodsDtlLogo1":"sys/o2o2/2018/06/08/o2oGoods_204023619125460.jpg",
							"goodsDtlLogo2":"sys/o2o2/2018/06/08/o2oGoods_205237786725382.jpg",
							"goodsDtlLogo3":"sys/o2o2/2018/06/08/o2oGoods_126775680425312.jpg",
							"goodsDtlLogo4":"sys/o2o2/2018/06/08/o2oGoods_188116711725211.jpg",
							"goodsImgBig1":"",
							"goodsImgBig2":"sys/o2o2/2018/06/08/o2oGoods_101166567107428.jpg",
							"goodsImgBig3":"sys/o2o2/2018/06/08/o2oGoods_761697151707340.jpg",
							"goodsImgLogo1":"sys/o2o2/2018/06/08/o2oGoods_134973721807173.jpg",
							"goodsImgLogo2":"sys/o2o2/2018/06/08/o2oGoods_185561871007236.jpg",
							"goodsImgLogo3":"sys/o2o2/2018/06/08/o2oGoods_541402491507117.jpg",
							"goodsNm":"女神1号混合果蔬片","goodsNo":"5200000032","goodsSale":90,
							"goodsSellLink":"https://h5.youzan.com/v2/goods/3ne98w78fzyp4",
							"goodsSellUrl":"pages/goods/detail/index?alias=3ne98w78fzyp4",
							"goodsTp":0,"id":43,"mchId":80000111,"mobile":"15056196065",
							"operator":"","updTs":"2018-06-14 15:07:01"
						},
						"broadSuccess":true,"code":200,"crtTs":"2018-06-11 15:59:33",
						"deliveryNo":"70000008","desc":"成功","goodsNo":"5200000032","goodsNum":30,
						"goodsNumLeft":0,"id":147,"mchId":"80000111","onlineFlag":"上架",
						"operator":"system","success":true,"updTs":"2018-06-22 15:05:00",
						"usrActSt":"5","usrActStDesc":"已结束","virtualApplyNum":130
					}
				],
				"areaNm":"天安花园-2","broadSuccess":true,"cellCd":"A100014243",
				"cityCd":"2900","cityNm":"上海市","code":200,"desc":"成功",
				"hostAddr":"35号负一层","hostId":"60262872",
				"shopGoods":[
					{
						"broadSuccess":true,"code":200,"crtTs":"2018-06-15 16:17:00",
						"desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/06/15/o2oBainaShop_102510289420361.jpg",
						"goodsImgSmall":"sys/o2o2/2018/06/15/o2oBainaShop_177948618020264.jpg",
						"goodsNm":"老管家洗衣槽清洁剂 2盒 6袋 洗机器清洗专家",
						"goodsNo":"6600000091","goodsPrice":"2560","goodsSale":90,
						"goodsSellNum":412,"goodsSort":894,"goodsSt":1,"id":31,
						"linkAddress":"https://h5.youzan.com/v2/goods/2fmrwxfdovuqw",
						"linkUrl":"pages/goods/detail/index?alias=2fmrwxfdovuqw","success":true
					},{
						"broadSuccess":true,"code":200,"crtTs":"2018-06-15 16:15:45",
						"desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/06/15/o2oBainaShop_139382624945773.jpg",
						"goodsImgSmall":"sys/o2o2/2018/06/15/o2oBainaShop_119874747945671.jpg",
						"goodsNm":"免水洗手液 3瓶 30ml/瓶","goodsNo":"6600000089",
						"goodsPrice":"1800","goodsSale":90,"goodsSellNum":214,"goodsSort":895,
						"goodsSt":1,"id":29,
						"linkAddress":"https://h5.youzan.com/v2/goods/272udqv8md0eg",
						"linkUrl":"pages/goods/detail/index?alias=272udqv8md0eg","success":true
					},{
						"broadSuccess":true,"code":200,"crtTs":"2018-06-15 16:12:03",
						"desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/06/15/o2oBainaShop_161806962623201.jpg",
						"goodsImgSmall":"sys/o2o2/2018/06/15/o2oBainaShop_922094036923121.jpg",
						"goodsNm":"安蓓美厨房纸巾 2层 80抽/包 6包装","goodsNo":"6600000087",
						"goodsPrice":"4500","goodsSale":90,"goodsSellNum":231,
						"goodsSort":896,"goodsSt":1,"id":27,
						"linkAddress":"https://h5.youzan.com/v2/goods/2xj1ih65rners",
						"linkUrl":"pages/goods/detail/index?alias=2xj1ih65rners",
						"success":true
					},{
						"broadSuccess":true,"code":200,"crtTs":"2018-06-15 16:09:52",
						"desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/06/15/o2oBainaShop_951139098991878.jpg",
						"goodsImgSmall":"sys/o2o2/2018/06/15/o2oBainaShop_214685114791575.jpg",
						"goodsNm":"女神1号 混合果蔬片 25g/包 6包","goodsNo":"6600000086",
						"goodsPrice":"2400","goodsSale":90,"goodsSellNum":120,"goodsSort":897,
						"goodsSt":1,"id":25,
						"linkAddress":"https://h5.youzan.com/v2/goods/3ne98w78fzyp4",
						"linkUrl":"pages/goods/detail/index?alias=3ne98w78fzyp4",
						"success":true
					},{
						"broadSuccess":true,"code":200,"crtTs":"2018-06-01 15:53:13","desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/06/01/o2oBainaShop_104906589691201.jpg",
						"goodsImgSmall":"sys/o2o2/2018/06/01/o2oBainaShop_200595591291071.jpg",
						"goodsNm":"棉森纯棉柔巾 一次性洗脸巾 100抽/盒 5盒装 图案随机",
						"goodsNo":"6600000062","goodsPrice":"7900","goodsSale":90,"goodsSellNum":689,
						"goodsSort":898,"goodsSt":1,"id":21,
						"linkAddress":"https://h5.youzan.com/v2/goods/3et2hx5f2lhg8",
						"linkUrl":"pages/goods/detail/index?alias=3et2hx5f2lhg8","success":true
					},{
						"broadSuccess":true,"code":200,"crtTs":"2018-06-01 15:52:26","desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/06/01/o2oBainaShop_216034375246609.jpg",
						"goodsImgSmall":"sys/o2o2/2018/06/01/o2oBainaShop_185211379246536.jpg",
						"goodsNm":"女神1号翡翠豆 蒜香味 25g/包 6包","goodsNo":"6600000061",
						"goodsPrice":"2400","goodsSale":90,"goodsSellNum":256,"goodsSort":899,
						"goodsSt":1,"id":19,
						"linkAddress":"https://h5.youzan.com/v2/goods/360idj7aqf51k",
						"linkUrl":"pages/goods/detail/index?alias=360idj7aqf51k","success":true
					},{
						"broadSuccess":true,"code":200,"crtTs":"2018-05-22 10:34:30","desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/05/22/o2oBainaShop_813323930870341.jpg",
						"goodsImgSmall":"sys/o2o2/2018/05/22/o2oBainaShop_424490733470301.jpg",
						"goodsNm":"蓝尊吸油纸 80张/盒 3盒装*2共6盒480张","goodsNo":"6600000043",
						"goodsPrice":"3990","goodsSale":0,"goodsSellNum":236,"goodsSort":900,
						"goodsSt":1,"id":15,
						"linkAddress":"https://h5.youzan.com/v2/goods/1y2wvnhqodqy0",
						"linkUrl":"pages/goods/detail/index?alias=1y2wvnhqodqy0","success":true
					},{
						"broadSuccess":true,"code":200,"crtTs":"2018-05-22 10:26:47",
						"desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/05/22/o2oBainaShop_199245505507492.jpg",
						"goodsImgSmall":"sys/o2o2/2018/05/22/o2oBainaShop_890324086807388.jpg",
						"goodsNm":"收口垃圾袋 15只/卷 10卷","goodsNo":"6600000036","goodsPrice":"2800",
						"goodsSale":90,"goodsSellNum":9912,"goodsSort":1050,"goodsSt":1,"id":13,
						"linkAddress":"https://h5.youzan.com/v2/goods/1yhnyy9bzh6fs",
						"linkUrl":"pages/goods/detail/index?alias=1yhnyy9bzh6fs","success":true
					},{
						"broadSuccess":true,"code":200,"crtTs":"2018-05-22 10:44:25",
						"desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/05/22/o2oBainaShop_138330894565373.jpg",
						"goodsImgSmall":"sys/o2o2/2018/05/22/o2oBainaShop_137088258565237.jpg",
						"goodsNm":"纳米清洁魔力 30片","goodsNo":"6600000052","goodsPrice":"3800",
						"goodsSale":90,"goodsSellNum":145,"goodsSort":1250,"goodsSt":1,"id":17,
						"linkAddress":"https://h5.youzan.com/v2/goods/277reneiw5jc8",
						"linkUrl":"pages/goods/detail/index?alias=277reneiw5jc8","success":true
					},{
						"broadSuccess":true,"code":200,"crtTs":"2018-04-08 13:36:51","desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/04/08/o2oBainaShop_176022862111181.jpg",
						"goodsImgSmall":"sys/o2o2/2018/04/08/o2oBainaShop_584098234510652.jpg",
						"goodsNm":"车载杯座抽纸12支装","goodsNo":"6600000019","goodsPrice":"7990",
						"goodsSale":90,"goodsSellNum":88,"goodsSort":2000,"goodsSt":1,"id":7,
						"linkAddress":"https://h5.youzan.com/v2/goods/3nrsc6afcnz3c",
						"linkUrl":"pages/goods/detail/index?alias=3nrsc6afcnz3c","success":true
					},{
						"broadSuccess":true,"code":200,"crtTs":"2018-05-22 10:11:11","desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/05/22/o2oBainaShop_346965206371176.jpg",
						"goodsImgSmall":"sys/o2o2/2018/05/22/o2oBainaShop_133192128871105.jpg",
						"goodsNm":"香港dodopapa爸爸制造宝宝汗巾 6包18片","goodsNo":"6600000022",
						"goodsPrice":"3990","goodsSale":0,"goodsSellNum":223,"goodsSort":2100,
						"goodsSt":1,"id":9,
						"linkAddress":"https://h5.youzan.com/v2/goods/2fsxzew5h3sq0",
						"linkUrl":"pages/goods/detail/index?alias=2fsxzew5h3sq0","success":true
					},{
						"broadSuccess":true,"code":200,"crtTs":"2018-05-22 10:24:20","desc":"成功",
						"goodsImgBig":"sys/o2o2/2018/05/22/o2oBainaShop_242525444260326.jpg",
						"goodsImgSmall":"sys/o2o2/2018/05/22/o2oBainaShop_393252854360218.jpg",
						"goodsNm":"15盒 3只/盒 环保粘贴式车载清洁袋","goodsNo":"6600000034",
						"goodsPrice":"2990","goodsSale":90,"goodsSellNum":689,"goodsSort":2200,
						"goodsSt":1,"id":11,
						"linkAddress":"https://h5.youzan.com/v2/goods/3ey0khepc7s3c",
						"linkUrl":"pages/goods/detail/index?alias=3ey0khepc7s3c","success":true
					}
				],
				"success":true
			},
			"desc":"成功",
			"success":true
		};
		if(res.code == 200){
	        if (res.data.acts.length) {//如果有活动显示活动
	            var _actList = res.data.acts;
	            var _flag = false;//判断是否取过推荐商品
        		var _recommend = {};
	            for(var key in _actList){
	              	var _st = _actList[key].usrActSt;
	              	var _btnText = '',_stUrl;
	              	//st:0即将开始,1进行中,2待配送,3已配送,4已领取,5已结束
	              	if(_st == 1){
	                	_btnText = '立即申请';
	              	}else if(_st == 0 || _st == 2){
	                	_btnText = '去看看';
	              	}else if(_st == 3){
	                	_btnText = '扫码开箱';
	              	}else if(_st == 4 || _st == 5){
	                	_btnText = '商品抢购';
	              	}
	              	_stUrl = _st == 0 ? 'wait' : _st == 1 ? 'in' : _st == 2 ? 'joined' : _st == 3 ? 'sended' : _st == 4 ?'received':'ended';
	              	if(key == 0){
	                	_stUrl = 'corner_'+_stUrl+'_large.png';
	              	}else{
	                	_stUrl = 'corner_' + _stUrl + '_small.png';
	              	}
	              	// _stText = 	_st==0?'即将开始':_st==1?'进行中':_st==5?'已结束':_st==4?'已领取':'已参与';
	              	_actList[key].actEndTs = _actList[key].actEndTs.substring(0,10).replace(/-/g,'.');
	              	_actList[key].actStartTs = _actList[key].actStartTs.substring(0, 10).replace(/-/g, '.');
	              	_actList[key].btnText = _btnText;
	             	_actList[key].stUrl = _stUrl;
	              	var _apply = _actList[key].goodsNum - _actList[key].goodsNumLeft;
	              	_actList[key].apply = _apply > 10000 ? parseInt(_apply / 1000) / 10 + '万':_apply;
	              	if(_actList[key].goodsNum>10000){
	                	_actList[key].goodsNum = parseInt(_actList[key].goodsNum/1000)/10+'万';
	              	}
	              	if (_actList[key].goodsNumLeft > 10000) {
	                	_actList[key].goodsNumLeft = parseInt(_actList[key].goodsNumLeft / 1000) / 10 + '万';
	              	}
	              	//获取推荐商品  && app.globalData.openBoxFlag==false
		            if (_actList[key].order != undefined && _actList[key].order.flag == '0' && _flag == false && _actList[key].actOpenImg && _actList[key].actOpenLink){
		                _flag = true;
		                _recommend = {
		                  actId:_actList[key].actId,
		                  goodsNo: _actList[key].bainaGoods.goodsNo,
		                  actOpenImg : _actList[key].actOpenImg,
		                  actOpenUrl : _actList[key].actOpenLink,
		                  orderNo: _actList[key].order.orderNo
		                }
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
	            var _goodsList = res.data.shopGoods ? res.data.shopGoods:[];
	            for(var key in _goodsList){
	              	if (_goodsList[key].goodsSale == 0 || _goodsList[key].goodsSale==100){
	                	_goodsList[key].discountAmt = (_goodsList[key].goodsPrice/100).toFixed(2);
	                	_goodsList[key].goodsAmt = (_goodsList[key].goodsPrice / 100).toFixed(2);
	              	}else{
	                	var _price = _goodsList[key].goodsPrice*_goodsList[key].goodsSale/100;
	                	_goodsList[key].discountAmt = (_price / 100).toFixed(2);
	                	_goodsList[key].goodsAmt = (_goodsList[key].goodsPrice/100).toFixed(2);
	              	}
	            }
	            _this.setState({
	            	activityList:_actList.slice(1),
	            	bannerAct:_actList[0],
	            	loadFailFlag:false,
	            	bnypList:_goodsList,
	            	bindAddr:bindAddr,
	            	recommendGood:_recommend,
	            	showRecommendFlag:_flag?true:false
	            });
	        }else{//没有活动,跳转到商城页面
	        	// showAlert({
	        	// 	cont:'很抱歉，您的附近暂无白拿活动，现在将为您跳转到白拿商城!',
	        	// 	confirm(){
	        	// 		_this.$router.push({
	        	// 			path:'/mall'
	        	// 		});
	        	// 	}
	        	// });
          	}
	    }else if(res.code == 101){//用户未成为会员
          	// _this.showHelpFlag = true;
          	_this.setState({phoneBinded:false});
        }else if(res.code == 102){//未绑定终端跳转到选择地址页面
        	_this.setState({
        		phoneBinded:true,
        		showHelpFlag:false
        	});
          	// _this.$router.push({ path: '/address' });
        }else{
          	//加载失败且第一次加载没数据显示页面打开失败
          	if(!_this.activityList.length){
            	_this.setState({loadFailFlag:true});
          	}
          	// showAlert({
          	// 	cont:res.data.desc
          	// });
        }
        _this.setState({loadFlag:true});
        // _this.$refs.loadmore.onTopLoaded();
	}
	chooseAddress(){}
	cliBanner(){}
	toMyActs(){}
	cliBtn(idx,actId,usrActSt){
		console.log("cliBtn:",idx,actId,usrActSt);
	}
	render(){
		return(
			<div>
				<Header bindAddr={this.state.bindAddr} chooseAddress={this.chooseAddress.bind(this)}/>
				{
					this.state.bannerAct?
					<Banner imgPre={this.state.imgPre} bannerAct={this.state.bannerAct} cliBanner={this.cliBanner} />
					:''
				}
				{
					this.state.activityList.length?
						<Acts imgPre={this.state.imgPre} 
							  activityList={this.state.activityList} 
							  cliBtn={this.cliBtn}
					    />:''
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
export default connect(mapStateToProps)(Index);