import * as types from "./actionTypes";
import * as ajaxActions from "./ajaxActions";
import Parse from "parse";
import createChannelNewProject from "./chatActions";
import history from "../history";

export const projActions = {
    createProject,
    getProjects,
    getProject
};

function createProject(projectName, projectManager, projectMembers) {
    return dispatch => {
        console.log("creating project" + projectName + "...");
        dispatch(request(projectName));

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
                project.save(null, {
                    success: function(project) {
                        saveMembersToProject(project, projectManager, projectMembers);
                        dispatch(success(project));
                    },
                    error: function(project, error) {
                        dispatch(failure(error));
                        console.log(error);
                    }
                });
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
        let currentUser = Parse.User.current();

        currentUser
            .fetch()
            .then(user => {
                let projects = user.get("projects");

                let projectList = [];
                projects.forEach(project => {
                    projectList.push({
                        name: project.get("name"),
                        id: project.id
                    });
                });
                dispatch(success(projectList));
                return projectList;
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
                res["boards"] = getTaskList(boards);

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
                        members.push({
                            fname: member.get("first_name"),
                            lname: member.get("last_name"),
                            member_id: member.id,
                            username: member.get("username")
                        });
                    });
                    res["members"] = members;
                    dispatch(success(res));
                    return res;
                });
            })
            .catch(error => {
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

function saveMembersToProject(project, projectManager, projectMembers) {
    let roles = {};
    let promises = [];
    let failedUsers = [];

    roles[projectManager.id] = "ProjectManager";
    projectManager.add("projects", project);
    projectManager.save();

    getMembers(projectMembers)
        .then(res => {
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
    let res = [];
    boards.forEach(board => {
        var Board = Parse.Object.extend("Board");
        var query = new Parse.Query(Board);

        query.equalTo("objectId", board.id);
        query.first().then(board => {
            var task_list = board.get("task_list");
            var real_task_list = [];

            if (task_list !== undefined) {
                task_list.forEach(task => {
                    var Task = Parse.Object.extend("Task");
                    var query = new Parse.Query(Task);
                    query.equalTo("objectId", task.id);

                    query.first().then(task => {
                        real_task_list.push({
                            id: task.id,
                            title: task.get("title"),
                            description: task.get("content"),
                            metadata: {
                                assigned_to: task.get("assigned_to"),
                                started_at: task.get("started_at"),
                                due_date: task.get("due_date"),
                                complettion_date: task.get("completion_date"),
                                priority: task.get("priority")
                            }
                        });
                    });
                });
            }

            res.push({
                id: board.id,
                title: board.get("title"),
                cards: real_task_list
                //updated_at: board.get("_updated_at")
            });
        });
    });

    return res;
}
