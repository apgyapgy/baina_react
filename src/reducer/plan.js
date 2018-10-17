import * as types from './actionType.js';
//设置LoginId
export function setLoginId(item){
  return{
    type:types.SETLOGINID,
    item
  }
}
//设置来源from
export function setFrom(item){
  return{
    type:types.SETFROM,
    item
  }
}
//设置cordova是否加载完成
export function setLoaded(item){
  return{
    type:types.SETLOADED,
    item
  }
}
export function setModalFlag(flag){
  return{
    type:types.SETMODALFLAG,
    flag
  }
}
export function setModalCont(item){
  return{
    type:types.SETMODALCONT,
    item
  }
}
// 添加计划
// export function addPlan(item) {
//   return {
//     type: types.ADD,
//     item
//   };
// }
// 删除计划
// export function deletePlan(id) {
//   return {
//     type: types.DELECT,
//     id
//   };
// }
// 显示隐藏弹层
// export function show(show) {
//   return {
//     type: types.SHOW,
//     show
//   };
// }