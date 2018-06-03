import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import _ from 'lodash'


export default function projectReducer(state = initialState, action) {
    switch (action.type) {
        case types.GET_PROJECT_LIST_REQUEST:
            return _.merge(state,{
                project_list_request: true
            });

        case types.GET_PROJECT_LIST_SUCCESS:
            return _.merge(state,{
                project_list_request: false,
                projects: action.projects
            });

        case types.GET_PROJECT_LIST_FAILURE:
            return _.merge(state,{
                project_list_request: false
            });

        case types.GET_PROJECT_REQUEST:
            return _.merge(state,{
                project_request: true
            });

        case types.GET_PROJECT_SUCCESS:
            return _.merge(state,{
                project_request: false,
                project_data: action.project_data
            });

        case types.GET_PROJECT_FAILURE:
            return _.merge(state,{
                project_request: false,
                project_error: action.error
            });

        default:
            return state;

    }
}
