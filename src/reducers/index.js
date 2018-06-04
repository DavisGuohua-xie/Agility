import { combineReducers } from "redux";
import ajaxCallsInProgress from "./ajaxStatusReducer";
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import taskReducer from "./taskReducer";
import memberReducer from "./memberReducer";

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    authReducer,
    projectReducer,
    taskReducer,
    memberReducer
});

export default rootReducer;
