import React,{Component} from 'react';
import {loadCordova} from '../../js/public.js';//jumpH5Page
import {connect} from 'react-redux';
import store from '../../reducer/store.js';
import {setLoginId} from '../../reducer/plan.js';//,setFrom,setLoaded
import fuApp from '../../js/libs/fuapp.js';
// import {Button,Modal} from 'semantic-ui-react';

//活动列表
function Acts(props){
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
			        	<img className='act_n_good_img' alt='' src={''+props.imgPre+item.bainaGoods.goodsImgBig3}/> 
			          	{
			          		item.usrActSt===0||item.usrActSt===1||item.usrActSt===2||item.usrActSt===3?
			          		<div>
			          			<img className='act_n_status' alt='' src={require('./'+item.stUrl)} />
			          			<img className='act_n_icon' alt='' src={require('./baina_icon.png')}/>
			          		</div>
			          		:
			          		<div>
			          			<img className='act_n_icon' alt='' src={require('./bnyp_icon.png')}/>
			          		</div>
			          	}
			          	<span className='act_n_name'>{item.actNm}</span>
			          	<div className='act_n_nums'>
		          			<span className='act_n_left'>申请人数({item.apply}人)</span>
		        		</div>
		        		<div className='act_n_nums_left'>
			            	<span className='left'>剩余</span>
			            	<span className='right'>{item.goodsNumLeft}份</span>
			          	</div>
			        </div>
		      	)
		    }
		</div>
	)
}

class MoreActs extends Component{
	constructor(props){
		super(props);
		this.state = {
			activityList:[],
			goodsActs:[],
			loadFailFlag:false,
			loaded:false,
			imgPre:this.props.globalData.imgPre
		}
		this.initData = this.initData.bind(this);
		this.getActs = this.getActs.bind(this);
	}
	initData(){
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
	cliBtn(_idx,_aid,_st) {//点击各个活动对应按钮
		console.log("hehe:",_idx,_aid,_st);return;
	    //st:0即将开始,1进行中,2待配送,3已配送,4已领取,5已结束
	    //1立即申请;0 2去看看;3扫码开箱;4 5商品抢购
	    //按钮为"去看看","立即申请",'扫码开箱'跳转活动页面
	    var _act = this.state.activityList[_idx];
	    if(_act.bnyp){//跳白拿优品
	      	var _url = _act.bainaGoods.goodsSellLink;
	      	// jumpH5Page(this,_url);
	    }else{
		    if (_st === 0 || _st=== 2 || _st === 1 || _st === 3) {
		    	var _url = '/activity?aid='+_aid;
		    	this.props.history.push(_url);
		    } else if (_st === 4 || _st === 5) {//已结束和已领取，跳有赞页面
		      	var _url = _act.bainaGoods.goodsSellLink;
      			// jumpH5Page(this,_url);
		    }
		}
	}
	getActs(){
		console.log("getActs")
		var _this = this;
		var res = {
		    "code": 200,
		    "data": {
		        "acts": [{
		            "actArea": "上海",
		            "actEndTs": "2018-07-09 00:00:00",
		            "actId": "1800000524",
		            "actNm": "老管家洗衣机槽清洗剂免费试用",
		            "actOpenImg": "sys/o2o2/2018/07/02/o2oBainaActivity_188963625154094.jpg",
		            "actOpenLink": "https://h5.youzan.com/v2/ump/promocard/fetch?alias=3dhohvhj",
		            "actOpenUrl": "pages/usercenter/promotion/promotion_detail?type=promocard&id=2566572",
		            "actSt": 2,
		            "actStartTs": "2018-07-02 17:23:40",
		            "actWeight": 905,
		            "applyFailBt": "优惠购买",
		            "applyFailLink": "https://h5.youzan.com/v2/goods/2fmrwxfdovuqw",
		            "applyFailLogo": "sys/o2o2/2018/07/02/o2oBainaActivity_162235631354156.jpg",
		            "applyFailUrl": "pages/goods/detail/index?alias=2fmrwxfdovuqw",
		            "applySuccBt": "优惠购买",
		            "applySuccLink": "https://h5.youzan.com/v2/goods/2fmrwxfdovuqw",
		            "applySuccLogo": "sys/o2o2/2018/07/02/o2oBainaActivity_162093906854046.jpg",
		            "applySuccUrl": "pages/goods/detail/index?alias=2fmrwxfdovuqw",
		            "bainaGoods": {
		                "contact": "",
		                "crtTs": "2018-06-15 15:20:43",
		                "goodsActLogo1": "sys/o2o2/2018/06/15/o2oGoods_512694572542578.jpg",
		                "goodsActLogo2": "sys/o2o2/2018/06/15/o2oGoods_510851195542511.jpg",
		                "goodsActLogo3": "sys/o2o2/2018/06/15/o2oGoods_210433221942061.jpg",
		                "goodsActLogo4": "sys/o2o2/2018/06/15/o2oGoods_140040300542152.jpg",
		                "goodsAmt": 2560,
		                "goodsDtlLogo1": "sys/o2o2/2018/06/15/o2oGoods_102014068442948.jpg",
		                "goodsDtlLogo2": "sys/o2o2/2018/06/15/o2oGoods_201147189142833.jpg",
		                "goodsDtlLogo3": "sys/o2o2/2018/06/15/o2oGoods_316060415342760.jpg",
		                "goodsDtlLogo4": "sys/o2o2/2018/06/15/o2oGoods_202631011642685.jpg",
		                "goodsImgBig1": "",
		                "goodsImgBig2": "sys/o2o2/2018/06/15/o2oGoods_854944771842449.jpg",
		                "goodsImgBig3": "sys/o2o2/2018/06/15/o2oGoods_191516463142386.jpg",
		                "goodsImgLogo1": "sys/o2o2/2018/06/15/o2oGoods_485077542442286.jpg",
		                "goodsImgLogo2": "sys/o2o2/2018/06/15/o2oGoods_715077409742350.jpg",
		                "goodsImgLogo3": "sys/o2o2/2018/06/15/o2oGoods_115075206142223.jpg",
		                "goodsNm": "老管家洗衣槽清洁剂",
		                "goodsNo": "5200000035",
		                "goodsSale": 90,
		                "goodsSellLink": "https://h5.youzan.com/v2/goods/2fmrwxfdovuqw",
		                "goodsSellUrl": "pages/goods/detail/index?alias=2fmrwxfdovuqw",
		                "goodsTp": 0,
		                "id": 47,
		                "mchId": 80000140,
		                "mobile": "",
		                "operator": "",
		                "updTs": "1900-01-01 00:00:00"
		            },
		            "broadSuccess": true,
		            "code": 200,
		            "crtTs": "2018-07-02 17:39:14",
		            "deliveryNo": "70000008",
		            "desc": "成功",
		            "goodsNo": "5200000035",
		            "goodsNum": 5,
		            "goodsNumLeft": 0,
		            "id": 183,
		            "mchId": "80000140",
		            "onlineFlag": "上架",
		            "operator": "system",
		            "success": true,
		            "transFlag": 1,
		            "updTs": "2018-08-01 14:00:05",
		            "usrActSt": "5",
		            "usrActStDesc": "已结束",
		            "virtualApplyNum": 900
		        },
		        {
		            "actEndTs": "2018-07-02 00:00:00",
		            "actId": "1800000483",
		            "actNm": "高级车载抽纸免费试用",
		            "actOpenImg": "sys/o2o2/2018/06/25/o2oBainaActivity_137119021254799.jpg",
		            "actOpenLink": "https://h5.youzan.com/v2/ump/promocard/fetch?alias=1i9txslw8",
		            "actOpenUrl": "pages/usercenter/promotion/promotion_detail?type=promocard&id=2528986",
		            "actSt": 2,
		            "actStartTs": "2018-06-25 15:00:00",
		            "actWeight": 984,
		            "applyFailBt": "优惠购买",
		            "applyFailLink": "https://h5.youzan.com/v2/goods/3nrsc6afcnz3c",
		            "applyFailLogo": "sys/o2o2/2018/06/25/o2oBainaActivity_471885734455287.jpg",
		            "applyFailUrl": "pages/goods/detail/index?alias=3nrsc6afcnz3c",
		            "applySuccBt": "优惠购买",
		            "applySuccLink": "https://h5.youzan.com/v2/goods/3nrsc6afcnz3c",
		            "applySuccLogo": "sys/o2o2/2018/06/25/o2oBainaActivity_170643292053838.jpg",
		            "applySuccUrl": "pages/goods/detail/index?alias=3nrsc6afcnz3c",
		            "bainaGoods": {
		                "contact": "",
		                "crtTs": "2018-04-12 14:39:09",
		                "goodsActLogo1": "sys/o2o2/2018/04/12/o2oGoods_147247341948806.jpg",
		                "goodsActLogo2": "sys/o2o2/2018/04/12/o2oGoods_420325885448635.jpg",
		                "goodsActLogo3": "sys/o2o2/2018/04/12/o2oGoods_747623369748329.jpg",
		                "goodsActLogo4": "sys/o2o2/2018/04/12/o2oGoods_711292890748376.jpg",
		                "goodsAmt": 7990,
		                "goodsDtlLogo1": "sys/o2o2/2018/04/13/o2oGoods_137017473189537.jpg",
		                "goodsDtlLogo2": "sys/o2o2/2018/04/13/o2oGoods_102892663889451.png",
		                "goodsDtlLogo3": "sys/o2o2/2018/04/13/o2oGoods_173884386989275.png",
		                "goodsDtlLogo4": "sys/o2o2/2018/04/13/o2oGoods_826988835885524.png",
		                "goodsImgBig1": "sys/o2o2/2018/04/28/o2oGoods_890569251871326.jpg",
		                "goodsImgBig2": "sys/o2o2/2018/05/15/o2oGoods_389177160345464.jpg",
		                "goodsImgBig3": "sys/o2o2/2018/05/15/o2oGoods_117683885745393.jpg",
		                "goodsImgLogo1": "sys/o2o2/2018/05/15/o2oGoods_119037033045283.jpg",
		                "goodsImgLogo2": "sys/o2o2/2018/05/15/o2oGoods_108395231945331.jpg",
		                "goodsImgLogo3": "sys/o2o2/2018/05/15/o2oGoods_958426755945186.jpg",
		                "goodsNm": "高级车载杯座抽纸",
		                "goodsNo": "5200000014",
		                "goodsSale": 90,
		                "goodsSellLink": "https://h5.youzan.com/v2/goods/3nrsc6afcnz3c",
		                "goodsSellUrl": "pages/goods/detail/index?alias=3nrsc6afcnz3c",
		                "goodsTp": 0,
		                "id": 17,
		                "mchId": 80000066,
		                "mobile": "",
		                "operator": "",
		                "updTs": "2018-06-14 15:11:52"
		            },
		            "broadSuccess": true,
		            "code": 200,
		            "crtTs": "2018-06-25 15:32:35",
		            "deliveryNo": "70000009",
		            "desc": "成功",
		            "goodsNo": "5200000014",
		            "goodsNum": 60,
		            "goodsNumLeft": 50,
		            "id": 171,
		            "mchId": "80000066",
		            "onlineFlag": "上架",
		            "operator": "system",
		            "success": true,
		            "transFlag": 1,
		            "updTs": "2018-08-01 14:00:05",
		            "usrActSt": "5",
		            "usrActStDesc": "已结束",
		            "virtualApplyNum": 10
		        },
		        {
		            "actEndTs": "2018-06-25 00:00:00",
		            "actId": "1800000470",
		            "actNm": "安蓓美厨房纸巾免费试用",
		            "actOpenImg": "sys/o2o2/2018/06/19/o2oBainaActivity_472670664422702.jpg",
		            "actOpenLink": "https://h5.youzan.com/v2/ump/promocard/fetch?alias=mluvoor3",
		            "actOpenUrl": "pages/usercenter/promotion/promotion_detail?type=promocard&id=2546613",
		            "actSt": 2,
		            "actStartTs": "2018-06-19 14:00:00",
		            "actWeight": 985,
		            "applyFailBt": "优惠购买",
		            "applyFailLink": "https://h5.youzan.com/v2/goods/2xj1ih65rners",
		            "applyFailLogo": "sys/o2o2/2018/06/19/o2oBainaActivity_140724876423247.jpg",
		            "applyFailUrl": "pages/goods/detail/index?alias=2xj1ih65rners",
		            "applySuccBt": "优惠购买",
		            "applySuccLink": "https://h5.youzan.com/v2/goods/2xj1ih65rners",
		            "applySuccLogo": "sys/o2o2/2018/06/19/o2oBainaActivity_208648025122284.jpg",
		            "applySuccUrl": "pages/goods/detail/index?alias=2xj1ih65rners",
		            "bainaGoods": {
		                "contact": "",
		                "crtTs": "2018-06-08 14:26:32",
		                "goodsActLogo1": "sys/o2o2/2018/06/08/o2oGoods_161493562692419.jpg",
		                "goodsActLogo2": "sys/o2o2/2018/06/08/o2oGoods_169401224992353.jpg",
		                "goodsActLogo3": "sys/o2o2/2018/06/08/o2oGoods_168788397691673.jpg",
		                "goodsActLogo4": "sys/o2o2/2018/06/08/o2oGoods_380373676391943.jpg",
		                "goodsAmt": 4500,
		                "goodsDtlLogo1": "sys/o2o2/2018/06/08/o2oGoods_477059440492689.jpg",
		                "goodsDtlLogo2": "sys/o2o2/2018/06/08/o2oGoods_311780971392622.jpg",
		                "goodsDtlLogo3": "sys/o2o2/2018/06/08/o2oGoods_296050852992556.jpg",
		                "goodsDtlLogo4": "sys/o2o2/2018/06/08/o2oGoods_212381820392488.jpg",
		                "goodsImgBig1": "",
		                "goodsImgBig2": "sys/o2o2/2018/06/08/o2oGoods_168172305138044.jpg",
		                "goodsImgBig3": "sys/o2o2/2018/06/08/o2oGoods_994111049938023.jpg",
		                "goodsImgLogo1": "sys/o2o2/2018/06/08/o2oGoods_132754694037983.jpg",
		                "goodsImgLogo2": "sys/o2o2/2018/06/08/o2oGoods_766163132737999.jpg",
		                "goodsImgLogo3": "sys/o2o2/2018/06/08/o2oGoods_191379689237935.jpg",
		                "goodsNm": "安蓓美厨房纸巾",
		                "goodsNo": "5200000033",
		                "goodsSale": 90,
		                "goodsSellLink": "https://h5.youzan.com/v2/goods/2xj1ih65rners",
		                "goodsSellUrl": "pages/goods/detail/index?alias=2xj1ih65rners",
		                "goodsTp": 0,
		                "id": 45,
		                "mchId": 80000127,
		                "mobile": "",
		                "operator": "",
		                "updTs": "2018-06-14 15:05:16"
		            },
		            "broadSuccess": true,
		            "code": 200,
		            "crtTs": "2018-06-19 15:07:03",
		            "deliveryNo": "70000009",
		            "desc": "成功",
		            "goodsNo": "5200000033",
		            "goodsNum": 30,
		            "goodsNumLeft": 8,
		            "id": 163,
		            "mchId": "80000127",
		            "onlineFlag": "上架",
		            "operator": "system",
		            "success": true,
		            "transFlag": 1,
		            "updTs": "2018-08-01 14:00:05",
		            "usrActSt": "5",
		            "usrActStDesc": "已结束",
		            "virtualApplyNum": 22
		        },
		        {
		            "actEndTs": "2018-07-02 00:00:00",
		            "actId": "1800000485",
		            "actNm": "宝宝汗巾免费试用",
		            "actOpenImg": "sys/o2o2/2018/06/25/o2oBainaActivity_108550258846869.jpg",
		            "actOpenLink": "https://h5.youzan.com/v2/ump/promocard/fetch?alias=fwpmtfe7",
		            "actOpenUrl": "pages/usercenter/promotion/promotion_detail?type=promocard&id=2522579",
		            "actSt": 2,
		            "actStartTs": "2018-06-25 15:00:00",
		            "actWeight": 985,
		            "applyFailBt": "优惠购买",
		            "applyFailLink": "https://h5.youzan.com/v2/goods/2fsxzew5h3sq0",
		            "applyFailLogo": "sys/o2o2/2018/06/25/o2oBainaActivity_211649569946970.png",
		            "applyFailUrl": "pages/goods/detail/index?alias=2fsxzew5h3sq0",
		            "applySuccBt": "优惠购买",
		            "applySuccLink": "https://h5.youzan.com/v2/goods/2fsxzew5h3sq0",
		            "applySuccLogo": "sys/o2o2/2018/06/25/o2oBainaActivity_163976567546806.png",
		            "applySuccUrl": "pages/goods/detail/index?alias=2fsxzew5h3sq0",
		            "bainaGoods": {
		                "contact": "",
		                "crtTs": "2018-04-27 18:04:34",
		                "goodsActLogo1": "sys/o2o2/2018/04/28/o2oGoods_191895099251632.jpg",
		                "goodsActLogo2": "sys/o2o2/2018/04/28/o2oGoods_137538527851472.jpg",
		                "goodsActLogo3": "",
		                "goodsActLogo4": "",
		                "goodsAmt": 3990,
		                "goodsDtlLogo1": "sys/o2o2/2018/04/28/o2oGoods_228769260206405.jpg",
		                "goodsDtlLogo2": "sys/o2o2/2018/04/28/o2oGoods_652076707606338.jpg",
		                "goodsDtlLogo3": "sys/o2o2/2018/04/28/o2oGoods_265023061206271.jpg",
		                "goodsDtlLogo4": "sys/o2o2/2018/04/28/o2oGoods_489901665406194.jpg",
		                "goodsImgBig1": "sys/o2o2/2018/04/28/o2oGoods_607805323606069.jpg",
		                "goodsImgBig2": "sys/o2o2/2018/05/15/o2oGoods_954310825907885.jpg",
		                "goodsImgBig3": "sys/o2o2/2018/05/15/o2oGoods_267292484207821.jpg",
		                "goodsImgLogo1": "sys/o2o2/2018/05/15/o2oGoods_130909403807669.jpg",
		                "goodsImgLogo2": "sys/o2o2/2018/05/15/o2oGoods_123143943107724.jpg",
		                "goodsImgLogo3": "sys/o2o2/2018/05/15/o2oGoods_895891007807561.jpg",
		                "goodsNm": "宝宝汗巾",
		                "goodsNo": "5200000016",
		                "goodsSale": 90,
		                "goodsSellLink": "https://h5.youzan.com/v2/goods/2fsxzew5h3sq0",
		                "goodsSellUrl": "pages/goods/detail/index?alias=2fsxzew5h3sq0",
		                "goodsTp": 0,
		                "id": 19,
		                "mchId": 80000070,
		                "mobile": "",
		                "operator": "",
		                "updTs": "2018-06-14 15:10:58"
		            },
		            "broadSuccess": true,
		            "code": 200,
		            "crtTs": "2018-06-25 15:37:27",
		            "deliveryNo": "70000009",
		            "desc": "成功",
		            "goodsNo": "5200000016",
		            "goodsNum": 30,
		            "goodsNumLeft": 16,
		            "id": 173,
		            "mchId": "80000070",
		            "onlineFlag": "上架",
		            "operator": "system",
		            "success": true,
		            "transFlag": 1,
		            "updTs": "2018-08-01 14:00:05",
		            "usrActSt": "5",
		            "usrActStDesc": "已结束",
		            "virtualApplyNum": 14
		        },
		        {
		            "actEndTs": "2018-06-25 00:00:00",
		            "actId": "1800000471",
		            "actNm": "女神1号混合果蔬片免费试吃",
		            "actOpenImg": "sys/o2o2/2018/06/19/o2oBainaActivity_122214237171458.jpg",
		            "actOpenLink": "https://h5.youzan.com/v2/ump/promocard/fetch?alias=1dcitpeo3",
		            "actOpenUrl": "pages/usercenter/promotion/promotion_detail?type=promocard&id=2546886",
		            "actSt": 2,
		            "actStartTs": "2018-06-19 14:00:00",
		            "actWeight": 986,
		            "applyFailBt": "优惠购买",
		            "applyFailLink": "https://h5.youzan.com/v2/goods/3ne98w78fzyp4",
		            "applyFailLogo": "sys/o2o2/2018/06/19/o2oBainaActivity_196509446171699.jpg",
		            "applyFailUrl": "pages/goods/detail/index?alias=3ne98w78fzyp4",
		            "applySuccBt": "优惠购买",
		            "applySuccLink": "https://h5.youzan.com/v2/goods/3ne98w78fzyp4",
		            "applySuccLogo": "sys/o2o2/2018/06/19/o2oBainaActivity_203902975471351.jpg",
		            "applySuccUrl": "pages/goods/detail/index?alias=3ne98w78fzyp4",
		            "bainaGoods": {
		                "contact": "",
		                "crtTs": "2018-06-08 11:47:05",
		                "goodsActLogo1": "sys/o2o2/2018/06/08/o2oGoods_189058698525142.jpg",
		                "goodsActLogo2": "sys/o2o2/2018/06/08/o2oGoods_163808308725082.jpg",
		                "goodsActLogo3": "sys/o2o2/2018/06/08/o2oGoods_133127136924680.jpg",
		                "goodsActLogo4": "",
		                "goodsAmt": 2400,
		                "goodsDtlLogo1": "sys/o2o2/2018/06/08/o2oGoods_204023619125460.jpg",
		                "goodsDtlLogo2": "sys/o2o2/2018/06/08/o2oGoods_205237786725382.jpg",
		                "goodsDtlLogo3": "sys/o2o2/2018/06/08/o2oGoods_126775680425312.jpg",
		                "goodsDtlLogo4": "sys/o2o2/2018/06/08/o2oGoods_188116711725211.jpg",
		                "goodsImgBig1": "",
		                "goodsImgBig2": "sys/o2o2/2018/06/08/o2oGoods_101166567107428.jpg",
		                "goodsImgBig3": "sys/o2o2/2018/06/08/o2oGoods_761697151707340.jpg",
		                "goodsImgLogo1": "sys/o2o2/2018/06/08/o2oGoods_134973721807173.jpg",
		                "goodsImgLogo2": "sys/o2o2/2018/06/08/o2oGoods_185561871007236.jpg",
		                "goodsImgLogo3": "sys/o2o2/2018/06/08/o2oGoods_541402491507117.jpg",
		                "goodsNm": "女神1号混合果蔬片",
		                "goodsNo": "5200000032",
		                "goodsSale": 90,
		                "goodsSellLink": "https://h5.youzan.com/v2/goods/3ne98w78fzyp4",
		                "goodsSellUrl": "pages/goods/detail/index?alias=3ne98w78fzyp4",
		                "goodsTp": 0,
		                "id": 43,
		                "mchId": 80000111,
		                "mobile": "",
		                "operator": "",
		                "updTs": "2018-06-14 15:07:01"
		            },
		            "broadSuccess": true,
		            "code": 200,
		            "crtTs": "2018-06-19 15:09:31",
		            "deliveryNo": "70000009",
		            "desc": "成功",
		            "goodsNo": "5200000032",
		            "goodsNum": 20,
		            "goodsNumLeft": 7,
		            "id": 165,
		            "mchId": "80000111",
		            "onlineFlag": "上架",
		            "operator": "system",
		            "success": true,
		            "transFlag": 1,
		            "updTs": "2018-08-01 14:00:05",
		            "usrActSt": "5",
		            "usrActStDesc": "已结束",
		            "virtualApplyNum": 13
		        },
		        {
		            "actEndTs": "2018-06-19 00:00:00",
		            "actId": "1800000355",
		            "actNm": "棉森纯棉洗脸巾免费试用",
		            "actOpenImg": "sys/o2o2/2018/06/11/o2oBainaActivity_119040551026607.jpg",
		            "actOpenLink": "https://h5.youzan.com/v2/ump/promocard/fetch?alias=1dh030e6n",
		            "actOpenUrl": "pages/usercenter/promotion/promotion_detail?type=promocard&id=2529276",
		            "actSt": 2,
		            "actStartTs": "2018-06-11 14:00:00",
		            "actWeight": 988,
		            "applyFailBt": "优惠购买",
		            "applyFailLink": "https://h5.youzan.com/v2/goods/3et2hx5f2lhg8",
		            "applyFailLogo": "sys/o2o2/2018/06/11/o2oBainaActivity_724651178775541.jpg",
		            "applyFailUrl": "pages/goods/detail/index?alias=3et2hx5f2lhg8",
		            "applySuccBt": "优惠购买",
		            "applySuccLink": "https://h5.youzan.com/v2/goods/3et2hx5f2lhg8",
		            "applySuccLogo": "sys/o2o2/2018/06/11/o2oBainaActivity_170664641574867.jpg",
		            "applySuccUrl": "pages/goods/detail/index?alias=3et2hx5f2lhg8",
		            "bainaGoods": {
		                "contact": "",
		                "crtTs": "2018-06-01 10:15:09",
		                "goodsActLogo1": "sys/o2o2/2018/06/01/o2oGoods_563270881508447.jpg",
		                "goodsActLogo2": "sys/o2o2/2018/06/01/o2oGoods_677959589608222.jpg",
		                "goodsActLogo3": "sys/o2o2/2018/06/01/o2oGoods_159955970907045.jpg",
		                "goodsActLogo4": "",
		                "goodsAmt": 7900,
		                "goodsDtlLogo1": "sys/o2o2/2018/06/01/o2oGoods_166932709109413.jpg",
		                "goodsDtlLogo2": "sys/o2o2/2018/06/01/o2oGoods_438398879409338.jpg",
		                "goodsDtlLogo3": "sys/o2o2/2018/06/01/o2oGoods_420225873409120.jpg",
		                "goodsDtlLogo4": "sys/o2o2/2018/06/01/o2oGoods_185449298108789.jpg",
		                "goodsImgBig1": "",
		                "goodsImgBig2": "sys/o2o2/2018/06/01/o2oGoods_180015430844516.jpg",
		                "goodsImgBig3": "sys/o2o2/2018/06/01/o2oGoods_104830714144451.jpg",
		                "goodsImgLogo1": "sys/o2o2/2018/06/11/o2oGoods_158406282649616.jpg",
		                "goodsImgLogo2": "sys/o2o2/2018/06/11/o2oGoods_563257562549662.jpg",
		                "goodsImgLogo3": "sys/o2o2/2018/06/11/o2oGoods_807453304849541.jpg",
		                "goodsNm": "棉森纯棉洗脸巾",
		                "goodsNo": "5200000028",
		                "goodsSale": 90,
		                "goodsSellLink": "https://h5.youzan.com/v2/goods/3et2hx5f2lhg8",
		                "goodsSellUrl": "pages/goods/detail/index?alias=3et2hx5f2lhg8",
		                "goodsTp": 0,
		                "id": 37,
		                "mchId": 80000112,
		                "mobile": "",
		                "operator": "",
		                "updTs": "2018-06-14 15:06:31"
		            },
		            "broadSuccess": true,
		            "code": 200,
		            "crtTs": "2018-06-11 14:57:55",
		            "deliveryNo": "70000009",
		            "desc": "成功",
		            "goodsNo": "5200000028",
		            "goodsNum": 30,
		            "goodsNumLeft": 0,
		            "id": 139,
		            "mchId": "80000112",
		            "onlineFlag": "上架",
		            "operator": "system",
		            "success": true,
		            "transFlag": 1,
		            "updTs": "2018-08-01 14:00:05",
		            "usrActSt": "5",
		            "usrActStDesc": "已结束",
		            "virtualApplyNum": 30
		        }],
		        "broadSuccess": true,
		        "code": 200,
		        "desc": "成功",
		        "success": true
		    },
		    "desc": "成功",
		    "success": true
		};
		if (res.code === 200) {
          	var _actList = res.data.acts;
          	for (var key in _actList) {
            	var _st = _actList[key].usrActSt;
            	var _btnText = '', _stUrl;
            	//st:0即将开始,1进行中,2待配送,3已配送,4已领取,5已结束
            	_stUrl = _st === 0 ? 'wait' : _st === 2 ? 'rece' : _st === 3 ? 'send' : _st === 1 ? 'in':_st===4?'ended' : 'send';
            	_stUrl = 'corner_' + _stUrl + '.png';
            	_actList[key].stUrl = _stUrl;
            	var _apply = _actList[key].goodsNum - _actList[key].goodsNumLeft;
            	_actList[key].apply = _apply > 10000 ? parseInt(_apply / 1000) / 10 + '万' : _apply;
            	if (_actList[key].goodsNum > 10000) {
              		_actList[key].goodsNum = parseInt(_actList[key].goodsNum / 1000) / 10 + '万';
            	}
           		if (_actList[key].goodsNumLeft > 10000) {
              		_actList[key].goodsNumLeft = parseInt(_actList[key].goodsNumLeft / 1000) / 10 + '万';
            	}
            	if(_actList[key].order){
	              	_actList[key].bnyp = false;
	            }else{
	              	_actList[key].bnyp = true;
	            }
          	}
          	console.log("actList:",_actList)
          	_this.setState({activityList:_actList});
        }else {
          	//加载失败且第一次加载没数据显示页面打开失败
          	if (!_this.state.activityList.length && !_this.state.goodsActs.length) {
            	_this.setState({loadFailFlag:true});
          	}
          	/*showAlert({
          		cont:res.desc,
          		confirm:function(){
            		_this.loadFailFlag=true;
            	}
          	});*/
        }
        _this.loaded = true;
	}
	componentWillMount(){
		if(this.props.globalData.loginId === ''){
			loadCordova(this,this.initData);
		}else{
			this.initData();
		}
	}
	render(){
		return(
			<div className="container clearfix">
			{
				this.state.activityList.length>0?
				<Acts imgPre={this.state.imgPre} 
					activityList={this.state.activityList} 
					cliBtn={this.cliBtn.bind(this)}
					bindAddr={this.state.bindAddr}
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
export default connect(mapStateToProps)(MoreActs);