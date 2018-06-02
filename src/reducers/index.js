import { combineReducers } from "redux";
import ajaxCallsInProgress from "./ajaxStatusReducer";
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import taskReducer from "./taskReducer";

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    authReducer,
    projectReducer,
    taskReducer
});

export default rootReducer;
