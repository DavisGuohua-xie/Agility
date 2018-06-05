import * as types from "./actionTypes";
import Parse from "parse";
import * as ajaxActions from "./ajaxActions";
import history from "../history";
import {projActions} from "./projActions";

export const memberActions = {
    addMember,
    removeMember
};

function addMember (username, project_id, user_role) {
    return dispatch => {
        // call create member request
        dispatch(request());
        let query = new Parse.Query(Parse.User);
        query.equalTo("username", username);
        query.first().then(user => {
            let query = new Parse.Query(Parse.Object.extend("Project"));
            user.add("projects", project_id);
            query.equalTo("objectId", project_id);
            query.first().then(project => {
                let user_id = user.id;
                console.log(user_id);
                
                let roles = project.get("roles");
                roles[user_id] = user_role;

                project.set("roles", roles);
                project.save().then( res => {
                    dispatch(success());
                    dispatch(projActions.getProject(project_id));
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
    function success() {
        return { type: types.ADD_MEMBER_SUCCESS};
    }
    function failure() {
        return { type: types.ADD_MEMBER_FAILURE};
    }
}

function removeMember (username, project_id) {
    return dispatch => {
        dispatch(request());
        let query = new Parse.Query(Parse.User);
        query.equalTo("username", username);
        query.first().then(user => {
            user.remove("projects", project_id);
            let query = new Parse.Query(Parse.Object.extend("Project"));
            console.log(query);
            query.equalTo("objectId", project_id);

            query.first().then(project => {
                //user.remove("projects", project_id);
                let user_id = user.id;
                let roles = project.get("roles");
                delete roles[user_id];

                project.set("roles", roles);
                project.save().then(res => {
                    dispatch(success());
                    dispatch(projActions.getProject(project_id));
                })
            }).catch( error => {
                console.log(error);
                dispatch(failure(error));
            })
        }).catch( error => {
            console.log(error);
            dispatch(failure(error));
        })

    }

    function request() {
        return { 
            type: types.REMOVE_MEMBER_REQUEST
        };
    }
    function success() {
        return { 
            type: types.REMOVE_MEMBER_SUCCESS
        };
    }
    function failure() {
        return { type: types.REMOVE_MEMBER_FAILURE};
    }
}