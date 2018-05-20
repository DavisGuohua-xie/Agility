import Parse from 'parse'

class UserModel extends Parse.User {



      static let NEVER = 0
      static let DAILY = 1
      static let HOURLY = 2


  constructor (){

    super()

    this.firstName = 'firstname'
    this.lastName = 'lastname'
    this.projects = []
    this.notification = HOURLY

  }

//TODO: Implement
  setFirstName (firstName){
    this.firstName = firstName;
  }


//TODO: Implement
  setLastName(lastName){
    this.lastName = lastName;
  }

//TODO: Implement
  addProjects(project){
    this.projects.add(project)
  }

  //TODO: Implement
  removeProjets(index){
    
  }


}
