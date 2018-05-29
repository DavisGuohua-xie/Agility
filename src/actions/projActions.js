import * as types from "./actionTypes";
import Parse from "parse";

export const projActions = {
    createProject
};

function createProject(projectName, projectManager, projectMembers, history) {
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

        project.save(null, {
            success: function(project) {
                saveMembersToProject(project, projectManager, projectMembers, history);
                dispatch(success(project));
            },
            error: function(project, error) {
                dispatch(failure(error));
                console.log(error);
            }
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

function saveMembersToProject(project, projectManager, projectMembers, history) {
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
