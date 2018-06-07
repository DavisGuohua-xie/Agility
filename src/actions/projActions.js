import * as types from "./actionTypes";
import * as ajaxActions from "./ajaxActions";
import Parse from "parse";
import createChannelNewProject from "./chatActions";
import history from "../history";
import { UserModel } from "../models/UserModel";
import toastr from "../components/common/toastrConfig";

export const projActions = {
    createProject,
    getProjects,
    getProject,
    addChannelToProject,
    addMember,
    removeMember
};

function createProject(projectName, projectManager, projectMembers) {
    return dispatch => {
        console.log("creating project" + projectName + "...");
        dispatch(request(projectName));

        getMembers(projectMembers).then(members => {
            for (var i = 0; i < members.length; i++) {
                if (members[i].length === 0) {
                    throw Error("One of your users does not exist.");
                }
            }

            let Project = Parse.Object.extend("Project");
            let project = new Project();

            project.set("name", projectName);
            project.set("boards", []);
            project.set("channels", []);
            project.set("tasks", []);
            project.set("updates", []);

            createChannelNewProject()
                .then(newChannel => {
                    return project.set("channels", [newChannel.id]);
                })
                .then(whatever => {
                    project.save().then(() => {
                        saveMembersToProject(project, projectManager, projectMembers).then(() => {
                            dispatch(success(project));
                        });
                    });
                });
        }).catch(error => {
            dispatch(failure(error));
            toastr.error(error, "Failed creating project!")
        });
    };

    function request(req) {
        return { type: types.CREATE_PROJECT_REQUEST, req };
    }
    function success(req) {
        return { type: types.CREATE_PROJECT_SUCCESS, req };
    }
    function failure(req) {
        return { type: types.CREATE_PROJECT_FAILURE, req };
    }
}

// get projects from current user
function getProjects() {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        UserModel.current()
            .then(userModel => {
                //console.log(userModel);

                let projects = [];
                let fields = ["roles", "tasks", "channels", "updates", "boards", "name"];

                userModel.getProjects().forEach(proj => {
                    let obj = {};
                    fields.forEach(field => {
                        obj[field] = proj.get(field);
                        //console.log(proj.get(field));
                    });

                    obj["id"] = proj.id;
                    //console.log(proj.id);

                    projects.push(obj);
                });

                dispatch(success(projects));
            })
            .catch(error => {
                dispatch(failure(error));
            });
    };

    function request() {
        return { type: types.GET_PROJECT_LIST_REQUEST };
    }

    function success(req) {
        return { type: types.GET_PROJECT_LIST_SUCCESS, projects: req };
    }

    function failure(req) {
        return { type: types.GET_PROJECT_LIST_FAILURE, req };
    }
}

// get project data given id
function getProject(project_id) {
    return dispatch => {
        console.log("In projAction.getProject()");
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        var res = {};
        var query = new Parse.Query(Parse.Object.extend("Project"));
        query.equalTo("objectId", project_id);
        query
            .first()
            .then(project => {
                console.log(project);
                res["name"] = project.get("name");
                var boards = project.get("boards");
                //res["boards"] = getTaskList(boards);
                getTaskList(boards).then(d => {
                    let boarddata = [];
                    let { promises, b_list } = d;
                    let i = 0;
                    promises.then(listOfTaskLists => {
                        console.log(listOfTaskLists);

                        listOfTaskLists.forEach((taskList, taskIndex) => {
                            let newBoard = {
                                id: b_list[i].id,
                                title: b_list[i].get("title"),
                                cards: []
                                //updated_at: board.get("_updated_at")
                            };
                            taskList.forEach(task =>
                                newBoard.cards.push({
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
                                })
                            );

                            boarddata.push(newBoard);
                            i++;
                        });

                        res["boards"] = JSON.parse(JSON.stringify(boarddata));

                        var channels = project.get("channels");
                        res["channels"] = channels;

                        var member_map = project.get("roles");
                        var member_ids = [];

                        for (var member_id in member_map) {
                            member_ids.push(member_id);
                        }

                        getMembersFromId(member_ids).then(result => {
                            var members = [];
                            result.forEach(member => {


                                let roles = project.get("roles");
                                let member_role;

                                switch(roles[member.id]) {
                                    case "ProjectManager":
                                        member_role = "Project Manager";
                                        break;
                                    case "Customer":
                                        member_role = "Customer";
                                        break;
                                    case "CEO":
                                        member_role = "CEO";
                                        break;
                                    default:
                                        member_role = "Team Member";
                                        break;
                                }

                                members.push({
                                    fname: member.get("first_name"),
                                    lname: member.get("last_name"),
                                    member_id: member.id,
                                    username: member.get("username"),
                                    role: member_role
                                });
                            });
                            res["members"] = members;
                            dispatch(success(res));
                            return res;
                        });
                    });
                });
            })
            .catch(error => {
                console.log(error);
                dispatch(failure(error));
            });
    };

    function request() {
        return { type: types.GET_PROJECT_REQUEST };
    }
    function success(req) {
        return { type: types.GET_PROJECT_SUCCESS, project_data: req };
    }
    function failure(err) {
        return { type: types.GET_PROJECT_FAILURE, error: err };
    }
}

// save roomid to project

function addChannelToProject(room_id, project_id) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        var query = new Parse.Query(Parse.Object.extend("Project"));
        query.equalTo("objectId", project_id);

        query.first().then(project => {
            project.add("channels", room_id);
            project
                .save()
                .then(() => {
                    dispatch(success());
                })
                .catch(error => {
                    dispatch(failure(error));
                });
        });
    };

    function request() {
        return { type: types.ADD_CHANNEL_TO_PROJECT_REQUEST };
    }
    function success() {
        return { type: types.ADD_CHANNEL_TO_PROJECT_SUCCESS };
    }
    function failure(err) {
        return { type: types.ADD_CHANNEL_TO_PROJECT_FAILURE, error: err };
    }
}

function saveMembersToProject(project, projectManager, projectMembers) {
    let roles = {};
    let promises = [];
    let failedUsers = [];

    roles[projectManager.id] = "ProjectManager";
    projectManager.add("projects", project);
    projectManager.save();

    getMembers(projectMembers)
        .then(res => {
            project.set("members", res);
            for (var i = 0; i < res.length; i++) {
                let user = res[i];

                // if user exists
                if (user.length !== 0) {
                    // ignore duplicates
                    if (!(user[0].id in roles)) {
                        user[0].add("projects", project);

                        switch (projectMembers[i].role) {
                            case 0:
                                roles[user[0].id] = "ProjectMember";
                                break;
                            case 1:
                                roles[user[0].id] = "ProjectManager";
                                break;
                            case 2:
                                roles[user[0].id] = "Customer";
                                break;
                            case 3:
                                roles[user[0].id] = "CEO";
                                break;
                            default:
                                roles[user[0].id] = "ProjectMember";
                        }

                        // save when done with user modifications
                        promises.push(
                            user[0].save(null, {
                                useMasterKey: true,
                                success: function(res) {
                                    console.log("successfully added project to user");
                                },
                                error: function(res, err) {
                                    console.log("failed adding project to user: " + err);
                                }
                            })
                        );
                    }

                    // user does not exist, user failed to be added.
                } else {
                    // TODO: passed failed users to error handler i guess...
                    failedUsers.push(projectMembers[i]);
                }
            }

            return Promise.all(promises);
        })
        .then(whatever => {
            // save project roles
            project.set("roles", roles);
            project.save(null, {
                success: function(project) {
                    history.push("/" + project.id + "/overview");
                },
                error: function(project, error) {
                    console.log("error in saving project roles! " + error);
                }
            });
        });
}

function getMembers(projectMembers) {
    var promises = [];

    for (var i = 0; i < projectMembers.length; i++) {
        var query = new Parse.Query(Parse.User);

        // TODO: email search functionality?
        query.equalTo("username", projectMembers[i].name);
        promises[i] = query.find();
    }
    return Promise.all(promises);
}

function getMembersFromId(member_ids) {
    var promises = [];

    for (var i = 0; i < member_ids.length; i++) {
        var query = new Parse.Query(Parse.User);

        // TODO: email search functionality?
        query.equalTo("objectId", member_ids[i]);
        promises[i] = query.first();
    }
    return Promise.all(promises);
}

function getTaskList(boards) {
    let boardQueries = [];
    boards.forEach(board => {
        let Board = Parse.Object.extend("Board");
        let query = new Parse.Query(Board);

        query.equalTo("objectId", board.id);
        boardQueries.push(query.first());
    });

    let b_list;

    return Promise.all(boardQueries).then(boardList => {
        b_list = boardList;
        let taskListPromises = [];
        boardList.forEach(board => {
            let task_list = board.get("task_list");

            let promises = [];

            if (task_list !== undefined) {
                task_list.forEach(task => {
                    console.log(task);
                    let Task = Parse.Object.extend("Task");
                    let query = new Parse.Query(Task);
                    query.equalTo("objectId", task.id);

                    promises.push(query.first());
                });
            }

            //console.log(promises);

            taskListPromises.push(Promise.all(promises));
        });

        return { promises: Promise.all(taskListPromises), b_list: b_list };
    });
}

function addMember (username, project_id, user_role) {
    return dispatch => {
        // call create member request
        dispatch(request())
        let query = new Parse.Query(Parse.User);
        query.equalTo("username", username);
        query.first().then(user => {
            let query = new Parse.Query(Parse.Object.extend("Project"));
            query.equalTo("objectId", project_id);
            query.first().then(project => {
                user.addUnique("projects", project);
                user.save(null, {
                    useMasterKey: true,
                    success: function (res) {
                        project.addUnique("members", user);
                        let user_id = user.id;
                        let roles = project.get("roles");
                        roles[user_id] = user_role;
                        project.set("roles", roles);
                        project.save(null, {
                            useMasterKey: true,
                            success: function (res) {
                                let newMember = {
                                    fname: user.get("first_name"),
                                    lname: user.get("last_name"),
                                    member_id: user.id,
                                    username: username
                                }
                                dispatch(success(newMember));
                            },
                            error: function (res, err) {
                                console.log(err);
                                dispatch(failure());
                            }
                        })
                    },
                    error: function (res, err) {
                        dispatch(failure());
                    }
                }).catch(error => {
                    console.log(error);
                    dispatch(failure);
                })

            })
        }).catch( error => {
            console.log(error);
            dispatch(failure());
        })
    }

    function request() {
        return { type: types.ADD_MEMBER_REQUEST};
    }
    function success(newMember) {
        return { type: types.ADD_MEMBER_SUCCESS, payload: newMember};
    }
    function failure() {
        return { type: types.ADD_MEMBER_FAILURE};
    }
}

function removeMember(username, project_id) {
    return dispatch => {
        dispatch(request());
        let query = new Parse.Query(Parse.User);
        query.equalTo("username", username);
        query
            .first()
            .then(user => {
                let query = new Parse.Query(Parse.Object.extend("Project"));
                console.log(query);
                query.equalTo("objectId", project_id);

                query.first().then(project => {
                    user.remove("projects", project);
                    user
                        .save(null, {
                            useMasterKey: true,
                            success: function(res) {
                                let user_id = user.id;
                                let roles = project.get("roles");
                                //let user_role = roles[user_id];
                                project.remove("members", user);
                                delete roles[user_id];

                                project.set("roles", roles);
                                project.save(null, {
                                    useMasterKey: true,
                                    success: function(res) {

                                        if (user.id === Parse.User.current().id) {
                                            history.push("/");
                                        }
                                        dispatch(success(user.id));
                                    },
                                    error: function(res, err) {
                                        console.log(err);
                                        dispatch(failure());
                                    }
                                });
                            },
                            error: function(res, err) {
                                dispatch(failure());
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            dispatch(failure());
                        });
                });
            })
            .catch(error => {
                console.log(error);
                dispatch(failure(error));
            });
    };

    function request() {
        return {
            type: types.REMOVE_MEMBER_REQUEST
        };
    }
    function success(removed_id) {
        return {
            type: types.REMOVE_MEMBER_SUCCESS,
            payload: removed_id
        };
    }
    function failure() {
        return { type: types.REMOVE_MEMBER_FAILURE };
    }
}
