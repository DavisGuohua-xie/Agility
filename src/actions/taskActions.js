import * as types from "./actionTypes";
import Parse from "parse";
import * as ajaxActions from "./ajaxActions";
//import history from "../history";
//import { UserModel } from "../models/UserModel";

export const taskActions = {
    createBoard,
    createTask,
    updateBoard,
    updateTask,
    moveTask,
    deleteTask
};

function createBoard(title, project_id, eventBus) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        let Board = Parse.Object.extend("Board");
        let board = new Board();

        board.set("title", title);
        //TODO: board.set("is_done", false);
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

        let currTime = new Date();
        let default_due = new Date();
        default_due.setTime(default_due.getTime() + 7 * 86400000);

        console.log(currTime.getTime());
        console.log(default_due.getTime() - currTime.getTime());

        task.set("title", card.title);
        task.set("assigned_to", username);
        task.set("content", card.description);
        task.set("started_at", currTime.getTime());
        task.set("due_date", default_due.getTime());
        task.set("priority", 1);
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
                console.log(error);
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
        query
            .first()
            .then(board => {
                board.set("title", newBoard.title);
                board.set("is_done", newBoard.is_done);
                board.save().then(board => {
                    dispatch(success(boardId, newBoard));
                });
            })
            .catch(error => {
                dispatch(failure(error));
            });
    };

    function success(boardId, newBoard) {
        return { type: types.UPDATE_BOARD_SUCCESS, req: { board_id: boardId, board: newBoard } };
    }
    function failure(req) {
        return { type: types.UPDATE_BOARD_FAILURE, req };
    }
}

function updateTask(taskId, boardId, newTask) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        console.log(taskId);
        console.log(boardId);
        console.log(newTask);
        let Task = Parse.Object.extend("Task");
        let query = new Parse.Query(Task);
        query.equalTo("objectId", taskId);
        query.first().then(task => {
            task.set("title", newTask.title);
            task.set("content", newTask.description);
            task.set("due_date", newTask.metadata.due_date);
            task.set("priority", newTask.metadata.priority);
            task.set("completion_date", newTask.metadata.completion_date);
            task
                .save()
                .then(task => {
                    console.log("updated task");
                    dispatch(success(newTask, taskId, boardId));
                })
                .catch(error => {
                    console.log("failed");
                    console.log(error);
                    dispatch(failure(error));
                });
        });
    };

    function success(newTask, taskId, boardId) {
        return {
            type: types.UPDATE_TASK_SUCCESS,
            req: { task: newTask, task_id: taskId, board_id: boardId }
        };
    }
    function failure(req) {
        return { type: types.UPDATE_TASK_FAILURE, req };
    }
}

function moveTask(oldboard_id, newboard_id, task_id, position) {
    return dispatch => {
        let Board = Parse.Object.extend("Board");
        let query = new Parse.Query(Board);

        query.equalTo("objectId", oldboard_id);
        query
            .first()
            .then(oldboard => {
                var Task = Parse.Object.extend("Task");
                var task = new Task();

                task.id = task_id;
                oldboard.remove("task_list", task);

                oldboard.save().then(() => {
                    let query = new Parse.Query(Board);

                    query.equalTo("objectId", newboard_id);
                    query.first().then(newboard => {

                        let cards = newboard.get("task_list");
                        cards.splice(position, 0, task);

                        newboard.set("task_list", cards);

                        newboard.save().then(() => {
                            dispatch(success(task_id, newboard_id, oldboard_id, position));
                        });
                    });
                });
            })
            .catch(error => {
                dispatch(failure(error));
            });
    };

    function success(taskId, boardId, oldId, position) {
        return {
            type: types.MOVE_TASK_SUCCESS,
            req: { task_id: taskId, new_id: boardId, old_id: oldId, position }
        };
    }
    function failure(req) {
        return { type: types.MOVE_TASK_FAILURE, req };
    }
}

function deleteTask(board_id, task_id) {
    return dispatch => {

        let Board = Parse.Object.extend("Board");
        let query = Parse.Query(Board);

        query.equalTo("objectId", board_id);
        query.first().then(board => {
            board.remove("task_list", task_id);
            board.save().then(() => {

            var Task = Parse.Object.extend("Task");
            var query = new Parse.Query(Task);

            query.get(task_id).then(task => {
                task.destroy({
                    success: () => {
                        dispatch(success());
                    },
                    error: error => {
                        dispatch(failure(error));
                    }
                });
            })     
            })
        });
    }

    function success() {
        return { type: types.DELETE_TASK_SUCCESS };
    }
    function failure(req) {
        return { type: types.DELETE_TASK_FAILURE, req };
    }

}