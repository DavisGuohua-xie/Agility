import { authAPI } from "../server/authAPI";
import {UserModel} from "../models/UserModel"
// import history from '../history'
import * as C from "./actionTypes";

// export const authActions = {
//   login,
//   logout,
//   register
// };

export const login = (username, password, success) => (dispatch) => {

//Now logging in
 dispatch(loginUser())
  UserModel.login(username, password, function(newUserModel){
    //No longer logging in anymoe
    dispatch(cancelLogin())
    //Successful login
    dispatch(successLogin(newUserModel))
    //Navigate to
    // console.log('[USER]: ', newUserModel.getProjects())
    // console.log(success)
    success()
  }, function(error){
    //No longer logging in anymore
    dispatch(cancelLogin())
    dispatch(loginError(error))

  })
}


const loginError = (newError) => {
  return {
    type: C.LOGIN_FAILURE,
    error: newError
  }
}

const successLogin = (loggedInUser) => {
  return {
    type: C.LOGIN_SUCCESS,
    userModel: loggedInUser
  }
}

const loginUser = () => {
  return {
    type: C.LOGIN_USER

  }
}

const cancelLogin = () => {
  return {
    type: C.CANCEL_LOGIN
  }
}
