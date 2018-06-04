import * as types from "./actionTypes";
import Parse from "parse";
import * as ajaxActions from "./ajaxActions";
import history from "../history";
import { UserModel } from "../models/UserModel";

export const taskActions = {
    createBoard,
    createTask
};

function createBoard(title, project_id, eventBus) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        let Board = Parse.Object.extend("Board");
        let board = new Board();

        board.set("title", title);
        board.set("task_list", []);

        board
            .save()
            .then(board => {
                let Project = Parse.Object.extend("Project");
                let query = new Parse.Query(Project);

                query.equalTo("objectId", project_id);
                query.first().then(project => {
                    project.add("boards", board);

                    project.save().then(res => {
                        dispatch(success(board));
                        //window.location.reload(true);
                        return board;
                    });
                });
            })
            .catch(error => {
                dispatch(failure(error));
            });
    };

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

function createTask(title, board_id, username) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        let Task = Parse.Object.extend("Task");
        let task = new Task();

        task.set("title", title);
        //let username = UserModel.getUsername();
        task.set("assigned_to", username);

        // Set content ??
        // Set due date
        // Set completion date, sets to now by default, what to change to?

        task
            .save()
            .then(task => {
                let Board = Parse.Object.extend("Board");
                let query = new Parse.Query(Board);

                query.equalTo("objectId", board_id);
                query.first().then(board => {
                    board.add("task_list", task);

                    board.save().then(res => {
                        let newTask = {
                            id: task.id,
                            title: task.get("title"),
                            description: task.get("content"),
                            metadata: {
                                assigned_to: task.get("assigned_to"),
                                started_at: task.get("started_at"),
                                due_date: task.get("due_date"),
                                completion_date: task.get("completion_date"),
                                priority: task.get("priority")
                            }
                        };
                        dispatch(success(newTask, board_id));
                        //window.location.reload(true);
                        return task;
                    });
                });
            })
            .catch(error => {
                dispatch(failure(error));
            });
    };

    function request(req) {
        return { type: types.CREATE_TASK_REQUEST, req };
    }
    function success(taskObject, board_id) {
        return { type: types.CREATE_TASK_SUCCESS, req: { taskObject, board_id } };
    }
    function failure(req) {
        return { type: types.CREATE_TASK_FAILURE, req };
    }
}
