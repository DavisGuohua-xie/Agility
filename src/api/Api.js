
import ApiController from './ApiController'
import AuthAPI from './auth/AuthApi'

export default class Api {

  constructor(){
    //Just responsible for initializing parse
    this.apiController = new ApiController();

    //Responsible for making authentication related calls
    this.authAPI = new AuthAPI()

//This keyword binding
    this.createNewAccount = this.createNewAccount.bind(this);
    this.login = this.login.bind(this);
  }


  createNewAccount(username, password, email, success, failure){
    //Can do pre processing here....
    this.authAPI.createNewAccount(username, password, email, success, failure);
  }

  login(username, password, success, failure){
    //Can do preprocessing here...
    this.authAPI.login(username, password, success, failure);
  }




}
