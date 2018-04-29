
import ApiController from './ApiController'

export default class Api {

  constructor(){
    this.apiController = new ApiController();
    this.createNewAccount = this.createNewAccount.bind(this);
  }


  createNewAccount(username, password, success, failure){
    //Can do pre processing here....
    this.apiController.createNewAccount(username, password, success, failure);
  }

}
