import { combineReducers } from 'redux';
import sales from "../redux/reducers";

const rootReducer = combineReducers({
    sales : sales
})

export default rootReducer;