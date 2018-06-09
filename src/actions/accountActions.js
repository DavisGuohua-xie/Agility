import * as C from "./actionTypes";
import * as ajaxActions from "./ajaxActions";
import Parse from "parse";
import { sendResetPasswordEmail } from "../server/emailAPI";
import toastr from "../components/common/toastrConfig";
import _ from "lodash";

export const accountActions = {
    getUserInfo,
    saveUserInfo,
    resetPassword
};

function getUserInfo() {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        let currentUser = Parse.User.current();

        let res = {};
        currentUser
            .fetch()
            .then(user => {
                res["username"] = user.get("username");
                res["first_name"] = user.get("first_name");
                res["last_name"] = user.get("last_name");
                res["email"] = user.get("email");
                res["notification"] = user.get("notification");

                dispatch(success(res));
            })
            .catch(error => {
                dispatch(failure(error));
            });
    };

    function request() {
        return { type: C.GET_USERINFO_REQUEST };
    }
    function success(req) {
        return { type: C.GET_USERINFO_SUCCESS, user_info: req };
    }
    function failure(err) {
        return { type: C.GET_USERINFO_FAILURE, error: err };
    }
}

export function resetPassword(email) {
    return dispatch => {
        dispatch(resetPasswordRequest());
        sendResetPasswordEmail(email)
            .then(response => response.json())
            .then(body => {
                console.log("response: ", body);
                if (_.isEmpty(body)) {
                    //Server returns empty object if works correctly... weird I know
                    dispatch(resetPasswordSuccess());
                    toastr.success("Password reset link sent!");
                } else {
                    toastr.error("Could not send password reset link!");
                    return Promise.reject(new Error("[ERROR]" + body));
                }
            })
            .catch(error => {
                dispatch(resetPasswordFailure(error));
            });
    };
}

function resetPasswordRequest() {
    return { type: C.RESET_PASSWORD_REQUEST };
}
function resetPasswordFailure(error) {
    console.log("[ERROR]", error.message);

    return { type: C.RESET_PASSWORD_FAILURE };
}
function resetPasswordSuccess() {
    return { type: C.RESET_PASSWORD_SUCCESS };
}

function saveUserInfo(userInfo) {
    return dispatch => {
        dispatch(ajaxActions.ajaxBegin());
        dispatch(request());

        let currentUser = Parse.User.current();

        currentUser.fetch().then(user => {
            user.set("first_name", userInfo.first_name);
            user.set("last_name", userInfo.last_name);

            if (userInfo.password !== "") {
                user.set("password", userInfo.password);
            }

            user.set("email", userInfo.email);
            user.set("notification", parseInt(userInfo.notification, 10));

            user.save()
                .then(() => {
                    dispatch(success());
                    toastr.success("Profile saved.", "Success!");
                })
                .catch(error => {
                    dispatch(failure(error));
                    toastr.error("Unable to save profile: " + error, "Something went wrong.");
                });
        });
    };

    function request() {
        return { type: C.SAVE_USERINFO_REQUEST };
    }
    function success() {
        return { type: C.SAVE_USERINFO_SUCCESS, save_userinfo_success: true };
    }
    function failure(err) {
        return { type: C.SAVE_USERINFO_FAILURE, error: err };
    }
}
