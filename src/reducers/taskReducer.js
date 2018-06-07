import * as types from "../actions/actionTypes";
import initialState from "./initialState";
//let Immutable = require("seamless-immutable").static;

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
            let board1 = Object.assign(
                {},
                state.board_data.filter(b => b.id === action.req.board_id)[0]
            );

            console.log(board1);
            console.log(action.req.task);

            return state.merge({
                board_data: [
                    ...state.board_data.filter(b => b.id !== action.req.board_id),
                    {
                        ...board1,
                        cards: [
                            ...board1.cards.filter(task => task.id !== action.req.task_id),
                            Object.assign({}, action.req.task, {
                                id: action.req.task_id,
                                laneId: action.req.board_id
                            })
                        ]
                    }
                ]
            });

        case types.MOVE_TASK_SUCCESS:
            let new_id = action.req.new_id;
            let old_id = action.req.old_id;
            let task_id = action.req.task_id;
            let position = action.req.position;

            let taskObj = Object.assign(
                {},
                state.board_data
                    .filter(b => b.id === old_id)[0]
                    .cards.filter(c => c.id === task_id)[0],
                { laneId: new_id } // assign new board id
            );

            console.log("in movetask reducer");
            console.log(new_id);
            console.log(old_id);
            console.log(state.board_data);

            console.log("---------------------------------");

            return state.merge({
                board_data: state.board_data.map((board, index) => {
                    if (board.id !== new_id && board.id !== old_id) return board;

                    if (board.id === old_id) {
                        return { ...board, cards: board.cards.filter(task => task.id !== task_id) };
                    }

                    // let newarr = board.cards.slice();
                    // newarr.splice(position, 0, taskObj);
                    return { ...board, cards: [...board.cards, taskObj] };
                })
            });

        case types.MOVE_TASK_FAILURE:
            return state;

        case types.DELETE_TASK_SUCCESS:
            return state;

        case types.DELETE_TASK_FAILURE:
            return state;

        default:
            return state;
    }
}
