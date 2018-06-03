import * as C from "../actions/actionTypes";
import initialState from "./initialState";
import _ from 'lodash'

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        //Starting fetching user with username and password
        case C.LOGIN_USER:
        console.log("[STATE]",state)
            return _.merge(state,{
                logging_in: true
            });

        //Stopped logging in for whatever reason
        case C.CANCEL_LOGIN:
            return _.merge(state,{
                logging_in: false
            });
        case C.LOGIN_SUCCESS: // Add current user to the store
            return _.merge(state,{  ...action.userModel, logged_in: true });

        case C.LOGIN_FAILURE: //Add error to list of current errors
            return _.merge(state,{
                errors: [...state.errors, action.error]
            });

        case C.SIGN_UP_USER:
            return _.merge(state,{
                signingUp: true
            });

        case C.CANCEL_REGISTRATION:
            return _.merge(state, {
                signingUp: false
            });

        case C.REGISTRATION_FAILURE:
            return _.merge(state,{
                errors: [...state.errors, action.newError]
            });
        case C.LOGOUT_SUCCESS:
            return _.merge(state,{
                logged_in: false,
                logging_in: false,
                currentUser: null,
                username: "",
                email: "",
                first_name: "",
                last_name: ""
            });
        default:
            return state;
    }
}
