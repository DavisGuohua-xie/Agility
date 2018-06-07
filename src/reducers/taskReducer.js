import * as types from "../actions/actionTypes";
import initialState from "./initialState";
//let Immutable = require("seamless-immutable").static;

export default function taskReducer(state = initialState, action) {
    let board;
    switch (action.type) {
        case types.CREATE_BOARD_REQUEST:
            return state.merge({
                create_board_request: true,
                newest_board: null
            });

        case types.CREATE_BOARD_SUCCESS:
            board = JSON.parse(JSON.stringify(action.board));

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
        case types.CREATE_TASK_SUCCESS:
            let newBoard = state.board_data.filter(b => b.id === action.req.board_id)[0];

            console.log(action.req.taskObject);

            return state.merge({
                board_data: [
                    ...state.board_data.filter(b => b.id !== action.req.board_id),
                    {
                        ...newBoard,
                        cards: [...newBoard.cards, Object.assign({}, action.req.taskObject)]
                    }
                ]
            });

        case types.SAVE_BOARD_SUCCESS:
            return state;

        case types.CREATE_BOARD_FAILURE:
            return state.merge({
                get_boards_request: false,
                newest_board: null
            });

        case types.GET_PROJECT_SUCCESS: // save boards data here
            //let newState;

            //console.log(action.project_data.boards[0].cards);

            return state.merge({
                board_data: JSON.parse(JSON.stringify(action.project_data.boards))
            });
        case types.GET_PROJECT_REQUEST: // save boards data here
            return state.merge({
                project_request: true,
                board_data: []
            });

        case types.UPDATE_BOARD_SUCCESS:
            let editingBoard = Object.assign(
                {},
                state.board_data.filter(b => b.id === action.req.board_id)[0]
            );

            return state.merge({
                board_data: [
                    ...state.board_data.filter(b => b.id !== action.req.board_id),
                    {
                        ...editingBoard,
                        title: action.req.board.title,
                        is_done: action.req.board.is_done
                    }
                ]
            });

        case types.UPDATE_TASK_SUCCESS:
            let board = Object.assign(
                {},
                state.board_data.filter(b => b.id === action.req.board_id)[0]
            );

            console.log(board);
            console.log(action.req.task);

            return state.merge({
                board_data: [
                    ...state.board_data.filter(b => b.id !== action.req.board_id),
                    {
                        ...board,
                        cards: [
                            ...board.cards.filter(task => task.id !== action.req.task_id),
                            Object.assign({}, action.req.task, {
                                id: action.req.task_id,
                                laneId: action.req.board_id
                            })
                        ]
                    }
                ]
            });

        default:
            return state;
    }
}
