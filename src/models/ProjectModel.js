import Parse from 'parse'

export class ProjectModel extends Parse.Object {
//PRESET ROLES
     static let PROJECT_MANAGER = "ProjectManager";
     static let TEAM_MEMBER = "TeamMember";
     static let CUSTOMER = "Customer";
     static let CEO = 'CEO';

//KEY VALUES for Project object
     static let ROLES = 'roles'
     static let TASKS = 'tasks'
     static let CHANNELS = 'channels'
     static let UPDATES = 'updates'
     static let BOARDS = 'boards'
     static let NAME = 'name'
     static let ID = '_id'


//These handlers will be used if you do not provide one to each function
     var defaultSuccessHandler = function(data){
       console.log('Succesfully got back data')
     }

     var defaultErrorHandler = function(data, error){
       console.log('data: ' + data + 'Could not be saved! \n')
       console.log('[ERROR]', error)
     }

//Just the name of the colleciton in the database
  className(){
    return 'Project';
  }

     constructor(){
       //This actually sets the classname
       super (className())
       //Other initialization

       this.roles = {} // Empty dictionary
       this.set(ProjectModel.ROLES, this.roles)

       this.tasks = [] //Empty array of tasks
       this.set(ProjectModel.TASKS, this.tasks)

       this.channels = [] //Empty array of channels
       this.set(ProjectModel.CHANNELS, this.channels)

       this.updates = [] //Empty array of updates objects
       this.set(ProjectModel.UPDATES, this.updates)

       this.boards  = [] //Empty array of boards
       this.set(ProjectModel.BOARDS, this.boards)


       this.name = "New Project"
       this.set(ProjectModel.NAME, this.name)

     }

     //Getters

     getRoles(){
      return this.get(ProjectModel.ROLES)
     }


    getTasks(){
      return this.get(ProjectModel.TASKS)
    }

    getChannels(){
      return this.get(ProjectModel.CHANNELS)
    }

    getUpdates(){
      return this.get(ProjectModel.UPDATES)
    }

    getBoards(){
      return this.get(ProjectModel.BOARDS)
    }

    getName(){
      return this.get(ProjectModel.NAME)
    }


    addRole(user, role, successHandler, errorHandler){
      var roles = this.get(ProjectModel.ROLES)
      //(user id) -> role map
      roles[user.id] = role;
      this.set(ProjectModel.ROLES, roles)

      saveData(this,successHandler, errorHandler)
    }


    removeUserFromRole(user, successHandler, errorHandler){
      var roles = this.get(ProjectModel.ROLES)

      delete roles[user.id]

      this.set(ProjectModel.ROLES, roles);

      saveData(this, successHandler, errorHandler)
    }


    addNewChannel(channel, successHandler, errorHandler){
      var channels = this.get(ProjectModel.CHANNELS)

      channels.push(channel)

      this.set(ProjectModel.CHANNELS)
      saveDate(this, successHandler, errorHandler)
    }



    addNewUpdate(update, successHandler, errorHandler){
      var updates = this.get(ProjectModel.UPDATES)

      updates.push(update)

      this.set(ProjectModel.UPDATES, updates)

      saveData(this, successHandler, errorHandler)
    }


    addBoard(board, successHandler, errorHandler){
      var boards = this.get(ProjectModel.BOARDS)
      boards.push(board)

      this.set(ProjectModel.BOARDS, boards)

      saveData(this, successHandler, errorHandler)

    }

    removeBoardByIndex(index, successHandler, errorHandler){
      var boards = this.get(ProjectModel.BOARDS)
      boards.splice(index, 0)

      this.set(ProjectModel.BOARDS, boards)

      saveData(this, successHandler, errorHandler)
    }

    removeBoardByBoard(board, successHandler, errorHandler){

      var boards = this.get(ProjectModel.BOARDS)
      boards.filter(function(currBoard){
        var currBoardId = currBoard.get(ProjectModel.ID)
        var boardRemoveId = board.get(ProjectModel.ID)

        return currBoardId != boardRemoveId
      })

      this.set(ProjectModel.BOARDS, boards)

      saveData(this, successHandler, errorHandler)

    }


    renameProject(newName, successHandler, errorHandler){

      this.set(ProjectModel.NAME, newName)
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
