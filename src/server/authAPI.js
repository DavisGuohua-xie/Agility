import Parse from "parse";

export const authAPI = {
  login,
  logout,
  register
};

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
  )
}

function logout() {
  return;
}

function register(username, password, email) {
  var user = new Parse.User();
  user.set("username", username);
  user.set("password", password);
  user.set("email", email);

  return user.signUp(null, {
    success: user => {
      return user;
    },
    error: error => {
      return error;
    }
  });
}
