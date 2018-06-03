import { combineReducers } from "redux";
import ajaxCallsInProgress from "./ajaxStatusReducer";
import authReducer from "./authReducer";
import chatReducer from "./chatReducer";
import projectReducer from "./projectReducer";
import taskReducer from "./taskReducer";

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    authReducer,
    chatReducer,
    projectReducer,
    taskReducer
});

export default rootReducer;
