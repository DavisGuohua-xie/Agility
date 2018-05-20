import Parse from 'parse'

class UserModel extends Parse.User {



      static let NEVER = 0
      static let DAILY = 1
      static let HOURLY = 2

      static let FIRST_NAME = 'first_name'
      static let LAST_NAME = 'last_name'
      static let PROJECTS = 'projects'
      static let NOTIFICATION = 'notification'
      static let ID = '_id'


      var defaultSuccessHandler = function(data){
        console.log('Succesfully got back data')
      }

      var defaultErrorHandler = function(data, error){
        console.log('data: ' + data + 'Could not be saved! \n')
        console.log('[ERROR]', error)
      }




  constructor (){

    super()

    this.firstName = 'firstname'
    this.set(UserModel.FIRST_NAME, this.firstName)

    this.lastName = 'lastname'
    this.set(UserModel.LAST_NAME, this.lastName)

    this.projects = []
    this.set(UserModel.PROJECTS, this.projects)


    this.notification = HOURLY
    this.set(UserModel.NOTIFICATION, this.notification)

  }


  getNotification(){
    return this.get(UserModel.NOTIFICATION)
  }

  getProjects(){
    return this.get(UserModel.PROJECTS)
  }

  getLastName(){
    return this.get(UserModel.LAST_NAME)
  }

  getFirstName(){
    return this.get(UserModel.FIRST_NAME)
  }

  setFirstName (firstName, successHandler, errorHandler){
    // this.firstName = firstName;
    this.set(UserModel.FIRST_NAME, firstName)
    saveData(this, successHandler, errorHandler)

  }


  setLastName(lastName, successHandler, errorHandler){
    // this.lastName = lastName;

    this.set(UserModel.LAST_NAME, lastName)
    saveData(this, successHandler, errorHandler)
  }


  addProjects(project, successHandler, errorHandler){
    // this.projects.add(project)
    // this.set(UserModel.PROJECTS, sucessHandler, errorHandler)
    var projects = this.get(UserModel.PROJECTS)

    projects.push(project);

    this.set(UserModel.PROJECTS, projects);
    saveData(this, successHandler, errorHandler)

  }

  removeProjectsByIndex(index){
    var projects = this.get(UserModel.PROJECTS)
    projects.splice(index, 1);
    this.set(UserModel.PROJECTS, projects);
    saveData(this, successHandler, errorHandler)

  }

  removeProjectByProject(project){
    var projects = this.get(UserModel.PROJECTS)

    projects.filter(function(currProject){
      //Change to ProjectModel.ID
      var currProjectId = currProject.get(UserModel.ID)
      var projectRemoveId = project.get(UserModel.ID)
      return currProjectId != projectRemoveId
    })

    this.set(UserModel.PROJECTS, projects);
    saveData(this, successHandler, errorHandler)
  }

  changeNotification(newNotification, sucessHandler, errorHandler){
    if (newNotification < NEVER) newNotification = NEVER;
    if (newNotification > HOURLY) newNotification = HOURLY;

    this.set(User.Model, newNotification)

    saveData(this, successHandler, errorHandler)
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
