import { combineReducers } from 'redux';

// Reducers
import globalData from './planList';

// Combine Reducers
var reducers = combineReducers({
    globalData: globalData
});

export default reducers;