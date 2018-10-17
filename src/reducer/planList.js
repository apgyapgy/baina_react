import * as types from './actionType.js';
const initialState = {
  loginId:'',//用户loginId
  imgPre:'https://staticds.fuiou.com/',//图片前缀
  from:'',//来源
  cordovaLoaded:false,//cordova是否加载完成
  showModalFlag:false,//是否显示弹窗
  modalCont:'',//弹窗内容
  // show: false, // 是否显示弹出
  // planlist: data // 初始的计划表
};

const globalDataReducer = function(state = initialState, action) {
  switch(action.type) {
    // 设置用户loginId
    case types.SETLOGINID:
      state.loginId = action.item;
      return state;
    //设置用户来源
    case types.SETFROM:
      state.from = action.item;
      return state;
    // 显示、隐藏弹出层
    case types.SETLOADED:
      state.cordovaLoaded = action.item;
      return state;
    case types.SETMODALFLAG:
      state.showModalFlag = action.flag;
      return state;
    case types.SETMODALCONT:
      state.modalCont = action.item;
      return state;
  }
  return state;
}
export default globalDataReducer;