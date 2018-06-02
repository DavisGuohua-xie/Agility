import * as types from "./actionTypes";
import Parse from "parse";
import * as ajaxActions from './ajaxActions';
import history from '../history'

export const taskActions = {
    createBoard,
    //createTask
};

function createBoard(title, project_id, eventBus) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        let Board = Parse.Object.extend("Board")
        let board = new Board();

        board.set("title", title);
        board.set("task_list", []);

        board.save().then(
            board => {
                let Project = Parse.Object.extend("Project");
                let query = new Parse.Query(Project);

                query.equalTo("objectId", project_id);
                query.first().then(project => {
                    project.add("boards", board);

                    project.save().then( res => {
                        dispatch(success(board));
                        window.location.reload(true);
                        return board;
                    })
                });
                
            }).catch(error => {
                dispatch(failure(error));
            })
    }

    function request() {
        return { type: types.CREATE_BOARD_REQUEST, board: null };
    }
    function success(req) {
        return { type: types.CREATE_BOARD_SUCCESS, board: req };
    }
    function failure(req) {
        return { type: types.CREATE_BOARD_FAILURE, req };
    }
}

/*
function createTask(taskName, board) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        let task = Parse.Object.extend("Task");
        let task = new Task();

        task.set("title", taskName);

        task.save(null, {
            success: function(task) {


            },
            error: function(project, error) {


            }
        });
    };

    function request(req) {
        return { type: types.CREATE_TASK_REQUEST, req };
    }
    function success(req) {
        return { type: types.CREATE_TASK_SUCCESS, req };
    }
    function failure(req) {
        return { type: types.CREATE_TASK_FAILURE, req };
    }
}
*/
