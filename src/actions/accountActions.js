import * as types from "./actionTypes";
import * as ajaxActions from "./ajaxActions";
import Parse from "parse";
import history from "../history";

export const accountActions = {
    getUserInfo,
    saveUserInfo
};

function getUserInfo() {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        let currentUser = Parse.User.current();

        let res = {}
        currentUser.fetch().then(user => {
            res["username"] = user.get("username");
            res["first_name"] = user.get("first_name");
            res["last_name"] = user.get("last_name");
            res["email"] = user.get("email");
            res["notification"] = user.get("notification");


            dispatch(success(res));
        }).catch(error => {
            dispatch(failure(error));
        });
    };

    function request() {
        return { type: types.GET_USERINFO_REQUEST };
    }
    function success(req) {
        return { type: types.GET_USERINFO_SUCCESS, user_info: req };
    }
    function failure(err) {
        return { type: types.GET_USERINFO_FAILURE, error: err };
    }
}

function saveUserInfo(userInfo) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        let currentUser = Parse.User.current();

        currentUser.fetch().then(user => {
            user.set("first_name", userInfo.first_name);
            user.set("last_name", userInfo.first_name);

            if (userInfo.password !== '') {
                user.set("password", userInfo.password)
            }
            
            user.set("email", userInfo.email);
            user.set("notification", parseInt(userInfo.notification, 10));

            user.save().then(() => {
                dispatch(success());
            }).catch(error => {
                dispatch(failure(error))
            })
        });
    }

    function request() {
        return { type: types.SAVE_USERINFO_REQUEST };
    }
    function success() {
        return { type: types.SAVE_USERINFO_SUCCESS, save_userinfo_success: true };
    }
    function failure(err) {
        return { type: types.SAVE_USERINFO_FAILURE, error: err };
    }
}
