import * as types from "./actionTypes";
import Parse from "parse";

export const projActions = {
  createProject
};

function createProject(projectName, projectMembers, history) {
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
        saveMembersToProject(project, projectMembers, history);
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

function saveMembersToProject(project, projectMembers, history) {
  let roles = {};

  let promises = []
  getMembers(projectMembers)
    .then(res => {
      res.forEach(user => {
        // if user exists
        if (user.length !== 0) {
          // ignore duplicate roles
          if (!(user[0].id in roles)) {
            // if usernames match, then this is the creator/project manager
            if (user[0].get("username") === projectMembers[0]) {
              roles[user[0].id] = "ProjectManager";
            } else {
              roles[user[0].id] = "ProjectMember";
            }

            // if user is not in any projects, we need to create the projects array
            if (!user[0].get("projects")) {
              user[0].set("projects", [project]);
            } else {
              user[0].add("projects", project);
            }

            // save when done with user modifications.
            promises.push(user[0].save(null, {
              useMasterKey: true,
              success: function(res) {
                console.log("successfully added project to user...");
              },
              error: function(res, err) {
                console.log("error adding project to user: " + err);
              }
            }));
          }
        }
      });

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
    query.equalTo("username", projectMembers[i]);
    promises.push(query.find());
  }

  return Promise.all(promises);
}
