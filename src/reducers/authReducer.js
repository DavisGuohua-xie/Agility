import * as types from '../actions/actionTypes';
import initialState from './initialState';

let getUserInfo = user => {
  let username = user.attributes.username;
  let email = user.attributes.email;
  let first_name = user.attributes.first_name;
  let last_name = user.attributes.last_name;
  let notification_frequency = user.attributes.notification;

  return {
    username: username,
    email: email,
    first_name: first_name,
    last_name: last_name,
    notification_freq: notification_frequency
  };
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return state.merge({
        logging_in: true
      });


    case types.REGISTRATION_SUCCESS:
    case types.LOGIN_SUCCESS:
      console.log('login_success reducer\n\n\n');
      
      let userInfo = getUserInfo(action.req);
      return state.merge({...userInfo, logging_in: false} );

    case types.LOGIN_FAILURE:
      return state.merge({
        logging_in: false
      });

    case types.LOGOUT_SUCCESS:
      return state.merge({
        logged_in: false
      });

    default:
      return state;
  }
}