import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function memberReducer (state = initialState, action) {
    switch (action.types) {
        case types.ADD_MEMBER_REQUEST:
            return state.merge ({
                add_member_request: true
            })
        case types.ADD_MEMBER_SUCCESS:
            return state.merge ({
                add_member_request: false,
            })

        case types.ADD_MEMBER_FAILURE:
            return state.merge ({
                add_member_request: false
            })

        case types.REMOVE_MEMBER_REQUEST:
            return state.merge ({
                remove_member_request: true
            })
        case types.REMOVE_MEMBER_SUCCESS: 
            return state.merge ({
                remove_member_request: false,
            })
        case types.REMOVE_MEMBER_FAILURE:
            return state.merge ({
                remove_member_request: false
            })
        default: 
            return state;
    }
}