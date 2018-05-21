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

    let roles = {};
    project.set("name", projectName);
    project.set("boards", []);
    project.set("channels", []);
    project.set("tasks", []);
    project.set("updates", []);

    roles[projectMembers[0].id] = "ProjectManager";
    projectMembers.shift();

    getMembers(projectMembers).then(res => {
      res.forEach(user => {
        console.log(user.length);
        if (user.length !== 0) {
            if (!(user[0].id in roles)) {
                roles[user[0].id] = "ProjectMember";
            }
        }
      });

      project.set("roles", roles);

      project.save(null, {
        success: function(project) {
          dispatch(success(project));
          history.push("/" + project.id + "/overview");
        },
        error: function(project, error) {
          dispatch(failure(error));
          console.log(error);
        }
      });
    });

    function request(req) {
      return { type: types.CREATE_PROJECT_REQUEST, req };
    }
    function success(req) {
      return { type: types.CREATE_PROJECT_SUCCESS, req };
    }
    function failure(req) {
      return { type: types.CREATE_PROJECT_FAILURE, req };
    }
  };
}

function getMembers(projectMembers) {
  var promises = [];

  for (var i = 0; i < projectMembers.length; i++) {
    var query = new Parse.Query(Parse.User);

    // TODO: email search functionality?
    query.equalTo("username", projectMembers[i]);
    promises.push(query.find());
  }

  console.log(promises);
  return Promise.all(promises);
}
