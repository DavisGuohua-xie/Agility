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

    roles["CEO"] = projectMembers[0];
    roles["ProjectManager"] = projectMembers[0];
    roles["Customer"] = [];

    let members = [];
    members.push(projectMembers[0]);
    projectMembers.shift();

    getMembers(projectMembers).then(res => {
      // TODO: this won't remove duplicate user entries...
      res.forEach(user => {
        console.log(user.length);
        if (user.length !== 0) {
          members.push(user[0]);
        }
      });

      roles["ProjectMember"] = members;
      project.set("roles", roles);

      project.save(null, {
        success: function(project) {
          dispatch(success(project));
          console.log("/" + project.id + "/overview");
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
