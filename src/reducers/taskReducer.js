import * as types from "../actions/actionTypes";
import initialState from "./initialState";


export default function taskReducer(state = initialState, action) {
    switch (action.type) {
        case types.CREATE_BOARD_REQUEST:
            return state.merge({
                create_board_request: true,
                newest_board: null
            });

        case types.CREATE_BOARD_SUCCESS:
            return state.merge({
                create_board_request: false,
                newest_board: action.board
            });

        case types.CREATE_BOARD_FAILURE:
            return state.merge({
                get_boards_request: false,
                newest_board: null
            });

        default:
            return state;

    }
}