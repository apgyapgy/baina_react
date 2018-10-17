import React,{ Component } from 'react';
import {connect} from 'react-redux';
import store from '../../reducer/store.js';
import {setLoginId} from '../../reducer/plan.js';//,setFrom,setLoaded
import fuApp from '../../js/libs/fuapp.js';
import {loadCordova,showAlert,getAjax,getParmas} from '../../js/public.js';//,jumpH5Page
import {Accordion, List} from 'antd-mobile';
import './address.css';
function Hosts(props){
	// console.log("Hosts:",props)
	return(
		<div>
			{
				props.cellNm?
				<div className='location_wrapper'>
				    <div className='location current_location'>
				      <img src={require('./location_map.png')} alt=''/><span>{props.cellNm}</span>
				    </div>
				    <div className='location re_location' onClick={()=>props.autoLocate}>
				      	<img src={require('./location_re.png')} alt=''/><span>重新定位</span>
				    </div>
				</div>
				:''
			}
			{
				props.searchResult.length?
				<div className='search_result_wrapper clearfix'>
					<div className='search_result_header_wrapper'>
						{
							props.boxTitle?
							<div className='search_result_title'>{props.boxTitle}</div>:
							<div className='search_result_title'>附近的<span className="bold">收件宝快递柜</span></div>
						}
				      	<button onClick={()=>props.showHelpModal} className='help'>为什么要选快递柜？</button>
				    </div>
				    {
				    	props.searchResult.map((item,index)=>
				    		<label className='result_item clearfix' key={index}>
					         	<div className='image_wrapper'>
					          		<img src={require('./area_grey.png')} alt=''/>
					        	</div> 
					        	<div className='result_area_info clearfix'>
						          	<div className='result_area_info_left'>
						            	<span className='area_name'>{item.areaNm?item.areaNm:props.cellNm}</span>
						            	<span className='area_info'>{item.hostAddr}</span>
						          	</div>
						          	<input type="radio" name="host" onChange={()=>props.changeHostId(item.hostId)} checked={props.hostId != '' && item.hostId == props.hostId} value={index} />
						        </div>
					      	</label>
				    	)
				    }
				</div>
				:''
			}
			{
				props.searchFailFlag && props.searchResult.length===0?
				<div className='search_fail'>您搜索的小区暂时没有收件宝快递柜</div>:
				''
			}
			{
				props.showHelpFlag?
				<div onClick={()=>props.hideHelpModal} className='help_modal_wrapper'>
				    <div className='help_cont clearfix'>
				      	<span className='help_heade'>为什么要选择小区快递柜？</span>
				      	<span className='help_intro clearfix'>——为了保护您的个人隐私，提升活动商品的配送效率，您申请参加的白拿活动商品会直接配送到您所选择的小区收件宝快递柜中。请您选择常用的收件宝快递柜。</span>
				        <button onClick={()=>props.hideHelpModal} className='help_btn'>我知道了</button>
				    </div>
				</div>
				:''
			}
		</div>
	)
}
function Citys(props){
	let onChange = (key) => {
    	console.log(key);
  	}
	return(
		<div style={{ marginTop: 10, marginBottom: 10 }}> 
			<Accordion accordion openAnimation={{}} className="my-accordion">
			{props.cityList.map((item,index)=>
	          	<Accordion.Panel header={item.tag} key={index}>
		            <List className="my-list">
		            	{item.list.map((list,idx)=>
		            		<List.Item key={idx} onClick={()=>props.wxSortPickerViewItemTap(index,idx)} >{list.cityNm}</List.Item>
		            	)}
		            </List>
		        </Accordion.Panel>
			)}
	        </Accordion>
		</div>
	)
}
class Address extends Component{
	constructor(props){
		super(props);
		this.state = {
			searchResult:[],
		    boxTitle:'',
		    select:{  //判断点击哪个字母下哪个市，即数组索引号
		      x:-1,
		      y:-1
		    },
		    cellCd:'',//页面参数,小区id
		    cellNm:'富友508',//小区名称
		    hostId:'',//其它页面传的hostId
		    wxSortPickerData:{},
		    letterList:[],//旁边字母选择列表
		    //mobile:'15316117950',//用户手机号
		    cityList:[], //城市 列表 
		    intoView:'',//scrollview滚动到的对应的哪个id
		    cityCd:'',//选中的城市编号
		    countyList:[],//选中城市的区
		    countyCd:'',
		    searchText:'',//搜索框内容 
		    searchFailFlag:false,
		    loadFailFlag: false,//是否加载失败
		    showCityListFlag:false,//是否显示选择城市列表
		    location:{
		      latitude: '', longitude:''
		    },//定位信息
		    selectedCity:{cityName:'',cityCd:''},//左上角显示的城市名称
		    hosts:[],//终端列表
		    showHelpFlag:false,//是否显示帮助弹窗
		    inputFlag:true,//是否正在输入，用于判断是否在中文输入法下
		    iosFlag:true,
		    from:''
		}
		this.init = this.init.bind(this);
		// this.compositionStart = this.compositionStart.bind(this);
		// this.compositionEnd = this.compositionEnd.bind(this);
		// this.setSearchText = this.setSearchText.bind(this);
	}
	componentWillMount(){
		var iOS = /(iPad|iPhone|iPod)/g.test(window.navigator.userAgent);
		if(iOS){
			this.setState({iosFlag:true});
		}
		var options = getParmas(this.props.location.search);
		console.log("options:",options);
		if (options.cellCd || options.cityCd){
			var _this = this;
			this.setState({
				cellCd:options.cellCd ? options.cellCd:'',
				cellNm:options.cellNm ? options.cellNm:'',
				selectedCity:{
		          	cityName: options.cityName ? options.cityName:'',
		          	cityCd: options.cityCd ? options.cityCd:''
		        },
		        hostId:options.hostId?options.hostId:''
			},function(){
				if(options.from){
			    	_this.from = options.from;
			    }
			    if(_this.cellCd !== '' && _this.cellCd != 'undefined'){
			     	_this.getHosts();
			    }else{
			    	if(_this.props.globalData.loginId === ''){
			    		loadCordova(_this,_this.init);
			    	}else{
			    		_this.init();
			    	}
			    }
			});
	    }else{
	    	if(this.props.globalData.loginId === ''){
	    		loadCordova(this,this.init);
	    	}else{
	    		this.init();
	    	}
	    }
	}
	getHosts(){
		var _this = this;
		console.log("state:",this.state);
	    getAjax({
			url:'baina/hosts',
			params:{
				cellCd:_this.state.cellCd
			},
			success(res){
				console.log("hosts:",res);
				if(res.code === 200){
					if(res.data.hosts.length){
						_this.setState({
							searchResult:res.data.hosts,
							boxTitle:''
						});
				    }else{
				    	_this.setState({
				    		showCityListFlag:false,
				    		searchResult:[],
				    		searchFailFlag:true,
				    		boxTitle:'选择常用快递柜'
				    	});
				    }
			    }else{
			    	showAlert({cont:res.desc});
			    }
			}
		});
	}
	autoLocate(){
		var _this = this;
	    // this.registerDeviceready(function(){
	    	// Indicator.open();
	    	fuApp.getLocation(function(data){
	    		console.log("getLocation:",data);
				if(data.rspCode === '0000'){
					getAjax({
						url:'baina/autoLocate',
						params:{
							lat: data.lat,
			        		lng: data.lnt
						},
						success(res){
							console.log("autoLocate:",res);
							if (res.data.code === 200) {
								_this.setState({
									selectedCity:{ 
						              	cityName:res.data.cityNm, 
						              	cityCd: res.data.cityCd
						            },
						            boxTitle:'',
						            searchResult:res.data.hosts.slice(0,6)
								})
					          	if (!res.data.hosts.length){
					            	showAlert({cont:"您附近的小区暂时没有收件宝快递柜"});
					          	}
					        } else {
					          	showAlert({cont:res.desc});
					        }
					        // Indicator.close();
						},
						fail(){
							// Indicator.close();
						}
					})
				}else{
					setTimeout(function(){
						// Indicator.close();
					},0)
					showAlert({cont:"定位失败!"});
				}
	        },function(){
	        	setTimeout(function(){
					// Indicator.close();
				},0)
	          	showAlert({cont:"获取用户信息失败"});
	        });
	    // });
	}
	sortCityList(data){
		var _cityList = [],_letterList=[];
	    _cityList = [
	      { tag: "A", list: [] }, { tag: "B", list: [] }, { tag: "C", list: [] }, 
	      { tag: "D", list: [] }, { tag: "E", list: [] }, { tag: "F", list: [] }, 
	      { tag: "G", list: [] }, { tag: "H", list: [] }, { tag: "I", list: [] }, 
	      { tag: "J", list: [] }, { tag: "K", list: [] }, { tag: "L", list: [] }, 
	      { tag: "M", list: [] }, { tag: "N", list: [] }, { tag: "O", list: [] }, 
	      { tag: "P", list: [] }, { tag: "Q", list: [] }, { tag: "R", list: [] }, 
	      { tag: "S", list: [] }, { tag: "T", list: [] }, { tag: "U", list: [] }, 
	      { tag: "V", list: [] }, { tag: "W", list: [] }, { tag: "X", list: [] }, 
	      { tag: "Y", list: [] }, { tag: "Z", list: [] }
	    ]
	    for(var key in data){
	      var _firstLetter = data[key].firstLetter;
	      var _index = _firstLetter.charCodeAt()-65;
	      _cityList[_index].list.push(data[key]);
	    }
	    //获取首字母数组，因返回的是倒序的，故再倒序一次，返回即为A-Z
	    for(var key = 0; key < _cityList.length;key++){
	      if(_cityList[key].list.length === 0){
	        _cityList.splice(key,1);
	        key--;
	      }else{
	        _letterList.push(_cityList[key].tag);
	      }
	    }
	    console.log('sortCityList:',_cityList, _letterList);
	    this.setState({
	    	cityList:_cityList,
	    	letterList:_letterList,
	    	showCityListFlag:true
	    });
	}
	init(){
		var _this = this;
		if(_this.props!=='undefined' && _this.props.globalData.loginId === ''){
			fuApp.userInfo(function(userInfo){
				console.log("userInfo:",userInfo);
				if(userInfo.rspCode === '0000'){
					store.dispatch(setLoginId(userInfo.loginId))
				}
		  		_this.autoLocate();
	        },function(){
	        	console.log("获取用户信息失败");
	          	// showAlert({cont:"获取用户信息失败"});
	        });
		}else{
			this.autoLocate();
		}
	}
	initData(){//获取大城市列表 
	    var _this = this;
	    getAjax({
	    	url:"baina/citys",
	    	params:{
	    		simpNm:''
	    	},
	    	success(res){
	    		console.log("citys:",res);
	    		_this.sortCityList(res.data.citys)
	    	}
	    });
	}
	getArea(e){//查询小区   未完待续
		console.log("getArea:",e);return;
	    this.countyCd=e.currentTarget.dataset.cd;
	    var _this = this;
	    console.log("getArea");
	}
	wxSortPickerViewItemTap(idx,idy) {//点击城市查询地区
	    var cd = this.state.cityList[idx].list[idy].cityCd;
	    var cityNm = this.state.cityList[idx].list[idy].cityNm;
	    if(cityNm.length>5){
	      cityNm = cityNm.substring(0,4)+'...';
	    }
	    this.setState({
	    	showCityListFlag:false,
	    	searchResult:[],
	    	selectedCity:{ cityName: cityNm , cityCd:cd }
	    });
	}
	toSearch(){//点击搜索按钮模糊查询
	    var _text = this.state.searchText.trim();
	    if(_text){
			var _this = this;
		    getAjax({
		    	url:'baina/qryHosts',
		    	params:{
		    		cellNm:_text,
	  				cityCd: _this.state.selectedCity.cityCd
		    	},
		    	notShowLoading:true,
		    	success(res){
		    		console.log("qryHosts:",_text,res);
		    		 if(res.code === 200){
		    		 	_this.setState({
		    		 		showCityListFlag:false,
		    		 		searchResult:res.data.hosts,
		    		 		searchFailFlag:res.data.hosts.length?false:true,
		    		 		boxTitle:'选择常用快递柜'
		    		 	});
			        }else{
			        	showAlert({cont:res.desc});
			        }
		    	}
		    });
	    }			   
	}
	showAreaList(){//显示城市列表
		var _this = this;
		this.setState({
			showCityListFlag:!this.state.showCityListFlag
		},()=>{
		    if(_this.state.showCityListFlag === true){
			    if (_this.state.cityList.length === 0){
			      	_this.initData();
			    }
		    }
		});
	}
	hideAreaList(){//隐藏城市列表
	    this.setState({
	    	showCityListFlag:false
	    });
	}
	clearSearchText(){//清空小区搜索框内容
		this.setState({
			searchText:''
		});
	    // this.$refs.search.value = '';
	}
	changeHostId(hid){
		// console.log("changeHostId:",hid);return;
		if(this.state.hostId !== hid){
			this.setState({
				hostId:hid
			});
			var _this = this;
			getAjax({
				url:'bainaH5/updUsr',
				params:{
					loginId:_this.props.globalData.loginId,
 					mobile:_this.props.globalData.loginId,
 					hostId:hid
				},
				success(res){
					console.log("updUsr:",res);
					if(res.code === 200){
						if(_this.from === 'mall'){
							_this.props.history.push('/index');
						}else{
							_this.props.history.goBack();
							// _this.$router.go(-1);
						}
					}else{
						showAlert({
							cont:res.desc
						});
					}
				}
			})
		}
	}
	showHelpModal(){//显示帮助弹窗
		// saveOperate(this, '白拿h5_为什么选择快递柜');
	    this.setState({showHelpFlag:true});
	}
	hideHelpModal() {//隐藏帮助弹窗
	    this.setState({
	    	showHelpFlag:false
	    });
	}
	preventD(){}
	start(){//compositionstart在输入一段需要确认的文本如拼音to汉字、语音时会触发
		// console.log("start")
		if(this.state.iosFlag){  				 
			this.setState({inputFlag:false});
		}
	}
	end(){//在拼音选词完成、语音输入完毕时会触发
		// console.log("end")
		this.setState({inputFlag:true});
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
	setSearchText(event){//input框内容变动时,赋值
		event.persist();
		// console.log("setSearchText",event);return;
	    if (this.state.selectedCity.cityName === '') {
	    	this.setState({
	    		searchText:''
	    	});
	      	// this.$refs.search.value = '';
	      	// Toast('请先选择您的城市');
	    }else{
	    	var _this = this;
	    	setTimeout(function(){
		    	if(_this.state.inputFlag){
		    		_this.setState({
		    			searchText:event.target.value
		    		},()=>{
			      		_this.toSearch();
		    		});
		      	}
		    },0);
	    }
	}
	compositionStart(){
		if(this.state.iosFlag){  				 
			this.setState({inputFlag : false});
		}
	}
	compositionEnd(){
		this.setState({
			inputFlag:true
		});
	}
	render(){
		return(
			<div>
				<div className='aheader'>
				    <div onClick={()=>this.showAreaList()} className='current_city'>
				      	{this.state.selectedCity.cityName?this.state.selectedCity.cityName:'选城市'}
				      	<img className={this.state.showCityListFlag?'':'active'} alt="" src={require('./area_arrow_top.png')}/>
				    </div>
				    <div className='search_wrapper'>
				      	<img className='search_img' onClick={()=>this.toSearch} alt="" src={require('./search.png')} />
				      	<input onChange={(e)=>this.setSearchText(e)} 
				      		   ref='searchInput' className='search_input' 
				      		   placeholder="请输入所在的小区"
				      		   onCompositionStart={()=>{this.compositionStart()}} 
				      		   onCompositionEnd={()=>{this.compositionEnd()}} />
				      	<div className='clear_wrapper' onClick={()=>this.clearSearchText} >
				        	<img className='close_img' src={require('./area_close.png')} alt="" />
				      	</div>
				    </div>
				</div>
				{
					this.state.showCityListFlag?
					<Citys showCityListFlag={this.state.showCityListFlag}
						cityList = {this.state.cityList}	
						wxSortPickerViewItemTap = {this.wxSortPickerViewItemTap.bind(this)}
					/>
					:
					<Hosts cellNm={this.state.cellNm}
						autoLocate  = {this.autoLocate.bind(this)}
						searchResult = {this.state.searchResult}
						boxTitle = {this.state.boxTitle}
						hostId = {this.state.hostId}
						showHelpFlag = {this.state.showHelpFlag}
						searchFailFlag = {this.state.searchFailFlag}
						showHelpModal = {this.showHelpModal.bind(this)}
						changeHostId = {this.changeHostId.bind(this)}
						hideHelpModal = {this.hideHelpModal.bind(this)}
					/>
					
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
export default connect(mapStateToProps)(Address);
// export default Address;