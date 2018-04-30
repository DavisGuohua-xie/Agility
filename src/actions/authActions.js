import { authAPI } from "../server/authAPI";
import * as types from "./actionTypes";
export const authActions = {
  login,
  logout,
  register
};

function login(username, password, history) {
  return dispatch => {
    dispatch(request({ username }));

    authAPI.login(username, password).then(
      user => {
        dispatch(success(user));
        console.log(user);
        history.push('/');
      },
      error => {
        dispatch(failure(error));
        console.log(error);
      }
    );
  };

  function request(req) {
    return { type: types.LOGIN_REQUEST, req };
  }
  function success(req) {
    return { type: types.LOGIN_SUCCESS, req };
  }
  function failure(req) {
    return { type: types.LOGIN_FAILURE, req };
  }
}

function logout() {
  authAPI.logout();
  return { type: types.LOGOUT };
}

function register(username, password, email, history) {
  return dispatch => {
    dispatch(request(username));

    authAPI.register(username, password, email).then(
      user => {
        dispatch(success());
        console.log(user);
        history.push('/');
        localStorage.setItem('token', user.attributes.sessionToken);
      },
      error => {
        dispatch(failure(error));
        console.log(error);
      }
    );
  };

  function request(req) {
    return { type: types.REGISTRATION_REQUEST, req };
  }
  function success(req) {
    return { type: types.REGISTRATION_SUCCESS, req };
  }
  function failure(req) {
    return { type: types.REGISTRATION_FAILURE, req };
  }
}
