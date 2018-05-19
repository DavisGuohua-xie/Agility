import * as types from "./actionTypes";
import Parse from 'parse';


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
        // TODO: set project members

        project.save(null, {
            success: function(project) {
                dispatch(success(project));
                console.log(project);
                //this.props.history.push(""); TODO: push to project overview of newly created project.
            },
            error: function(project, error) {
                dispatch(failure(error));
                console.log(error);
            }
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
    }
}