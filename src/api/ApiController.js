
import Parse from 'parse'
import Config from './Config'

export default class ApiController{

constructor(){
  //Parse configuration
Parse.initialize(Config.APP_ID);
Parse.serverURL = Config.SERVER_URL;
}



}
