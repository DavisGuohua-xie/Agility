import { combineReducers } from "redux";
import ajaxCallsInProgress from "./ajaxStatusReducer";
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    authReducer,
    projectReducer
});

export default rootReducer;
