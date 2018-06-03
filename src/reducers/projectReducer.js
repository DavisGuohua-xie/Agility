import * as types from "../actions/actionTypes";
import initialState from "./initialState";


export default function projectReducer(state = initialState, action) {
    switch (action.type) {
        case types.GET_PROJECT_LIST_REQUEST:
            return state.merge({
                project_list_request: true
            });

        case types.GET_PROJECT_LIST_SUCCESS:
            return state.merge({
                project_list_request: false,
                projects: action.projects
            });

        case types.GET_PROJECT_LIST_FAILURE:
            return state.merge({
                project_list_request: false
            });

        case types.GET_PROJECT_REQUEST:
            return state.merge({
                project_request: true
            });

        case types.GET_PROJECT_SUCCESS:
            return state.merge({
                project_request: false,
                project_data: action.project_data
            });

        case types.GET_PROJECT_FAILURE:
            return state.merge({
                project_request: false,
                project_error: action.error
            });
        case types.ADD_CHANNEL_TO_PROJECT_REQUEST:
            return state.merge({
                actp_request: true,
            });

        case types.ADD_CHANNEL_TO_PROJECT_SUCCESS:
            return state.merge({
                actp_request: false,
            });
            
        case types.ADD_CHANNEL_TO_PROJECT_FAILURE:
            return state.merge({
                actp_request: false,
                actp_error: action.error
            });

        default:
            return state;

    }
}