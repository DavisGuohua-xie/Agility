import Parse from 'parse'

//Notification levels
       let NEVER = 0
       let DAILY = 1
       let HOURLY = 2

//User member fields/keys
       let FIRST_NAME = 'first_name'
       let LAST_NAME = 'last_name'
       let PROJECTS = 'projects'
       let NOTIFICATION = 'notification'
       let USERNAME = 'username'
       let PASSWORD = 'password'
       let EMAIL = 'email'
       let ID = '_id'

//Default completion handlers..
      var defaultSuccessHandler = function(data){
        console.log('Succesfully got back data')
      }

      var defaultErrorHandler = function(data, error){
        console.log('data: ' + data + 'Could not be saved! \n')
        console.log('[ERROR]', error)
      }


//UserModel does not extends Parse.User but is more like a wrapper
export class UserModel {

  constructor (){
//Let the super class be responsible for setting the classname
    this.user = new Parse.User()

    this.firstName = 'firstname'
    this.user.set(FIRST_NAME, this.firstName)

    this.lastName = 'lastname'
    this.user.set(LAST_NAME, this.lastName)

    this.projects = []
    this.user.set(PROJECTS, this.projects)


    this.notification = HOURLY
    this.user.set(NOTIFICATION, this.notification)





  }

//Getters
  getNotification(){
    return this.user.get(NOTIFICATION)
  }

  getProjects(){
    return this.user.get(PROJECTS)
  }

  getLastName(){
    return this.user.get(LAST_NAME)
  }

  getFirstName(){
    return this.user.get(FIRST_NAME)
  }


//Setters/Modifiers

 createAccount(username, password, email='', successHandler, errorHandler){

    this.user.set(USERNAME, username)
    this.user.set(PASSWORD, password)
    this.user.set(EMAIL, email)

    this.user.signUp(null, {
      success: successHandler,
      error: errorHandler
    });


  }

static login(username, password, successHandler, errorHandler){

    Parse.User.login(username, password, {
      success: successHandler ,
      error: errorHandler
    })


  }

  static current(){

  var currentUser = new UserModel();
  currentUser.user = Parse.User.current();
  return currentUser;
}

  static logout(completionHandler){
    Parse.currentUser().logout()
    .then(completionHandler)
  }

  setFirstName (firstName, successHandler, errorHandler){
    // this.firstName = firstName;
    this.user.set(FIRST_NAME, firstName)
    console.log('setFirstName()')
    this.saveData(this.user, successHandler, errorHandler)

  }


  setLastName(lastName, successHandler, errorHandler){
    // this.lastName = lastName;

    this.user.set(LAST_NAME, lastName)
    this.saveData(this.user, successHandler, errorHandler)
  }


  addProject(project, successHandler, errorHandler){

    var projects = this.user.get(PROJECTS)

    projects.push(project);

    this.user.set(PROJECTS, projects);
    this.saveData(this.user, successHandler, errorHandler)

  }

  removeProjectByIndex(index, successHandler, errorHandler){
    var projects = this.user.get(PROJECTS)
    projects.splice(index, 1);
    this.user.set(PROJECTS, projects);
    this.saveData(this.user, successHandler, errorHandler)

  }

  removeProjectByProject(project, successHandler, errorHandler ){
    var projects = this.get(PROJECTS)

    projects.filter(function(currProject){
      //Change to ProjectModel.ID
      var currProjectId = currProject.get(ID)
      var projectRemoveId = project.get(ID)
      return currProjectId != projectRemoveId
    })

    this.user.set(PROJECTS, projects);
    this.saveData(this.user, successHandler, errorHandler)
  }

  changeNotification(newNotification, successHandler, errorHandler){
    if (newNotification < NEVER) newNotification = NEVER;
    if (newNotification > HOURLY) newNotification = HOURLY;

    this.user.set(NOTIFICATION, newNotification)

    this.saveData(this.user, successHandler, errorHandler)
  }



  saveData(pfobject, successHandler, errorHandler){
   if (successHandler == null || successHandler == undefined) {
     successHandler = this.defaultSuccessHandler
   }

   if (errorHandler == null || errorHandler == undefined){
     errorHandler = this.defaultErrorHandler
   }


   pfobject.save(null, {
     success: successHandler,
     error: errorHandler
   })
  }

}

Parse.Object.registerSubclass('User', UserModel);
