import * as types from "./actionTypes";
import Parse from "parse";
import * as ajaxActions from "./ajaxActions";
import history from "../history";
import { UserModel } from "../models/UserModel";

export const taskActions = {
    createBoard,
    createTask,
    updateBoard,
    updateTask
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

function createTask(card, board_id, username) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        let Task = Parse.Object.extend("Task");
        let task = new Task();

        task.set("title", card.title);
        task.set("assigned_to", username);
        task.set("content", card.description);
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

function updateBoard(boardId, newBoard) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        let Board = Parse.Object.extend("Board");
        let query = new Parse.Query(Board);
        query.equalTo("objectId", boardId);
        query.first().then(board => {
            board.set("title", newBoard.title);
            board.set("is_done", newBoard.is_done);
            board
                .save()
                .then(board => {
                    dispatch(success(newBoard));
                })
                .catch(error => {
                    dispatch(failure(error));
                });
        });
    };

    function success(boardId, newBoard) {
        return { type: types.UPDATE_BOARD_SUCCESS, req: { board_id: boardId, board: newBoard } };
    }
    function failure(req) {
        return { type: types.UPDATE_BOARD_FAILURE, req };
    }
}
function updateTask(taskId, newTask) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        let Task = Parse.Object.extend("Task");
        let query = new Parse.Query(Task);
        query.equalTo("objectId", taskId);
        query.first().then(task => {
            task.set("title", newTask.title);
            task.set("content", newTask.content);
            task.set("due_date", newTask.due_date);
            task.set("priority", newTask.priority);
            task.set("completion_date", newTask.completion_date);
            task
                .save()
                .then(task => {
                    dispatch(success(newTask));
                })
                .catch(error => {
                    dispatch(failure(error));
                });
        });
    };

    function success(req) {
        return { type: types.UPDATE_TASK_SUCCESS, board: req };
    }
    function failure(req) {
        return { type: types.UPDATE_TASK_FAILURE, req };
    }
}
