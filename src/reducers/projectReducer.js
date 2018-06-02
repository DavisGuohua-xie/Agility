import * as types from "../actions/actionTypes";
import initialState from "./initialState";


export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case types.GET_PROJECT_REQUEST:
            return state.merge({
                project_request: true
            });

        case types.GET_PROJECT_SUCCESS:
            return state.merge({
                project_request: false,
                projects: action.projects
            });

        case types.GET_PROJECT_FAILURE:
            return state.merge({
                project_request: false
            });

        default:
            return state;

    }
}