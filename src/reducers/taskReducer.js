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
            let board = JSON.parse(JSON.stringify(action.board));

            return state.merge({
                create_board_request: false,
                newest_board: action.board,
                board_data: [
                    ...state.board_data,
                    {
                        id: board.objectId,
                        title: board.title,
                        cards: board.task_list
                    }
                ]
            });

        case types.CREATE_BOARD_FAILURE:
            return state.merge({
                get_boards_request: false,
                newest_board: null
            });

        case types.GET_PROJECT_SUCCESS: // save boards data here
            return state.merge({
                project_request: false,
                board_data: action.project_data.boards
            });

        default:
            return state;
    }
}
