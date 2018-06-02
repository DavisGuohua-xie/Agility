import * as types from "./actionTypes";
import Parse from "parse";
import * as ajaxActions from "./ajaxActions";
import history from "../history";

export const memberActions = {
    addMember,
    removeMember
};

function addMember (username, project_id, user_role) {
    return dispatch => {
        // call create member request
        dispatch(request());
        let query = Parse.Query(Parse.User);
        query.equalTo("username", username);

        query.first().then(user => {
            let query = Parse.Query(Parse.Object.extend("Project"));

            query.equalTo("objectId", project_id);

            query.first().then(project => {
                user.add("projects", project_id);
                let roles = project.get("roles");

                roles[username] = user_role;

                project.set("roles", roles);
                project.save().then( res => {
                    // you finished saving, call dispatch success
                }).catch( error => {
                    // something went wrong, call dispatch failure
                })
            })
        })
    }

    function request() {
        return { type: types.CREATE_PROJECT_REQUEST };
    }
    function success(req) {
        return { type: types.CREATE_PROJECT_SUCCESS, req };
    }
    function failure(req) {
        return { type: types.CREATE_PROJECT_FAILURE, req };
    }
}

function removeMember () {
    return dispatch => {

    }
}