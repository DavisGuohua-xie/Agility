import Parse from "parse";

export const authAPI = {
    login,
    logout,
    register
};

const DEFAULT_NOTIFICATION_SETTING = 2;

function login(username, password) {
    return Parse.User.logIn(
        username,
        password,
        {
            // success callback
            success: user => {
                return user;
            }
        },
        {
            // error callback
            error: error => {
                return error;
            }
        }
    );
}

function logout() {
    return Parse.User.logOut();
}

function register(username, password, email, fname, lname) {
    var user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);
    user.set("first_name", fname);
    user.set("last_name", lname);
    user.set("notification", DEFAULT_NOTIFICATION_SETTING);

    return user.signUp(null, {
        success: user => {
            return user;
        },
        error: error => {
            return error;
        }
    });
}
