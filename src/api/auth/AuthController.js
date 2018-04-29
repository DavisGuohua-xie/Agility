import Parse from 'parse'


export default class AuthController {

  /*
  constructor(){

  }
  */

  createNewAccount(username, password, email, successHandler, errorHandler){

  //Create new parse user
     var user = new Parse.User();
     user.set("username", username);
     user.set("password", password);
     user.set("email", email);

  //Handle case where no completion handlers are defined
    var defaultSuccess = function(user){
      alert("user succesfully saved!");
    }
    var defaultFailure = function(user, error){
      alert("user not saved because... " + error);
    }

    if (successHandler == null){
      successHandler = defaultSuccess;
    }

    if (errorHandler == null){
      errorHandler = defaultFailure;
    }


      user.signUp(null, {success: successHandler, error: errorHandler});
  }

  login(username, password, successHandler, errorHandler){
    //Logs in user if successful returns error otherwise
    Parse.User.logIn(username, password, {success: successHandler, error: errorHandler})
  }
}
