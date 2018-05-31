import { combineReducers } from "redux";
import ajaxCallsInProgress from "./ajaxStatusReducer";
import authReducer from "./authReducer";
import chatReducer from "./chatReducer";

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    authReducer,
    chatReducer
});

export default rootReducer;
