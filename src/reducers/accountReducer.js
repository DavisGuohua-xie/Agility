import * as types from "../actions/actionTypes";
import initialState from "./initialState";


export default function accountReducer(state = initialState, action) {
    switch (action.type) {
        case types.GET_USERINFO_REQUEST:
            return state.merge({
                userinfo_request: true
            });

        case types.GET_USERINFO_SUCCESS:
            return state.merge({
                userinfo_request: false,
                user_info: action.user_info
            });
        case types.GET_USERINFO_FAILURE:
            return state.merge({
                userinfo_request: false,
                userinfo_error: action.error
            });

            case types.SAVE_USERINFO_REQUEST:
            return state.merge({
                save_userinfo_request: true
            });

        case types.SAVE_USERINFO_SUCCESS:
            return state.merge({
                save_userinfo_request: false,
            });
        case types.SAVE_USERINFO_FAILURE:
            return state.merge({
                save_userinfo_request: false,
                save_userinfo_error: action.error
            });
        case types.RESET_PASSWORD_REQUEST:
           return state.merge({
             sending_password_reset: true,
           });

        case types.RESET_PASSWORD_FAILURE:
           return state.merge({
             sending_password_reset: false,
             password_email_sent: false
           })
           
        case types.RESET_PASSWORD_SUCCESS:
            return state.merge({
              sending_password_reset: false,
              password_email_sent: true
            })
        default:
            return state;

    }
}
