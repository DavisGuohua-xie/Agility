import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import _ from 'lodash'



export default function taskReducer(state = initialState, action) {
    switch (action.type) {
        case types.CREATE_BOARD_REQUEST:
            return _.merge(state,{
                create_board_request: true,
                newest_board: null
            });

        case types.CREATE_BOARD_SUCCESS:
            return _.merge(state,{
                create_board_request: false,
                newest_board: action.board
            });

        case types.CREATE_BOARD_FAILURE:
            return _.merge(state,{
                get_boards_request: false,
                newest_board: null
            });

        default:
            return state;

    }
}
