import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function projectReducer(state = initialState, action) {
    switch (action.type) {
        case types.GET_PROJECT_LIST_REQUEST:
            return state.merge({
                project_list_request: true,
                creating_project: false
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

        case types.CREATE_PROJECT_REQUEST:
            return state.merge({
                creating_project: true
            });

        case types.CREATE_PROJECT_SUCCESS:
        case types.CREATE_PROJECT_FAILURE:
            return state.merge({
                creating_project: false
            });
        case types.ADD_CHANNEL_TO_PROJECT_REQUEST:
            return state.merge({
                actp_request: true
            });

        case types.ADD_CHANNEL_TO_PROJECT_SUCCESS:
            return state.merge({
                actp_request: false
            });

        case types.ADD_CHANNEL_TO_PROJECT_FAILURE:
            return state.merge({
                actp_request: false,
                actp_error: action.error
            });

        case types.ADD_MEMBER_REQUEST:
            return state.merge({
                add_member_request: true
            });

        case types.ADD_MEMBER_SUCCESS:
            return state.merge({
                ...state.project_data,
                members: [...state.project_data.members, action.payload]
            });

        case types.ADD_MEMBER_FAILURE:
            return state.merge({
                add_member_request: false
            });

        case types.REMOVE_MEMBER_REQUEST:
            return state.merge({
                remove_member_request: true
            });
        case types.REMOVE_MEMBER_SUCCESS:
            return state.merge({
                ...state.project_data,
                members: [...state.project_data.members, action.payload]
            });

        case types.REMOVE_MEMBER_FAILURE:
            return state.merge({
                remove_member_request: false
            });

        default:
            return state;
    }
}
