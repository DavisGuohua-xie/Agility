import Parse from 'parse'




class ProjectModel extends Parse.Object {

     static let PROJECT_MANAGER = "ProjectManager";
     static let TEAM_MEMBER = "TeamMember";
     static let CUSTOMER = "Customer";
     static let CEO = 'CEO';


  className(){
    return 'Project';
  }

     constructor(){
       super (className())
       //Other initialization

       this.roles = {} // Empty dictionary
       this.tasks = [] //Empty array of tasks
       this.channels = [] //Empty array of channels
       this.updates = [] //Empty array of updates objects
       this.boards  = [] //Empty array of boards
       this.name = "New Project"

     }


//TODO add role
    addRole(user, role=TEAM_MEMBER){
      this.roles[user] = role;
    }
//TODO add new task
    addNewTask(){

    }

//// TODO: Remove task for index
    removeTaskWithIndex(index){

    }
//TODO: Remove task with task
    removeTaskWithTask(task){

    }


   //TODO: Create a new channel to project
    addNewChannel(){

    }

    //TODO: Create new update for the projects
    addNewUpdate(){

    }


    //TODO: Add a new board to the project
    addBoard(){

    }

    //TODO: Remove board from the projects
    removeBoard(){

    }


    renameProject(newName){
      this.name = newName
    }












}
