
import Parse from 'parse'
import Config from './Config'

export default class ApiController{

constructor(){
Parse.initialize(Config.APP_ID);
Parse.serverURL = Config.SERVER_URL;
}

createNewAccount(username, password, successHandler, errorHandler){

//Create new parse user
   var user = new Parse.User();
   user.set("username", username);
   user.set("password", password);

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
  Parse.User.logIn(username, password, {success: successHandler, error: errorHandler})
}







}
