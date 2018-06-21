import * as types from './actionType.js';
const initialState = {
  loginId:'',//用户loginId
  imgPre:'https://staticds.fuiou.com/',//图片前缀
  from:'',//来源
  cordovaLoaded:false,//cordova是否加载完成
  // show: false, // 是否显示弹出
  // planlist: data // 初始的计划表
};

const globalDataReducer = function(state = initialState, action) {
  let list = state.planlist;
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
  }
  return state;
}
// const planReducer = function(state = initialState, action) {
//   let list = state.planlist;
//   switch(action.type) {
//     // 添加计划
//     case types.ADD:
//       list.push(action.item);
//       return Object.assign({}, state, { planlist: list });
//     // 删除计划
//     case types.DELECT:
//       let newstate = list.filter((item) => item.id != action.id);
//       return Object.assign({}, state, { planlist: newstate });;
//     // 显示、隐藏弹出层
//     case types.SHOW:
//       return Object.assign({}, state, { show: action.show });
//   }
//   return state;
// }

export default globalDataReducer;