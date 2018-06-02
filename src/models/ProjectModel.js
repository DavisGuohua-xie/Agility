import Parse from 'parse'



//PRESET ROLES
let PROJECT_MANAGER = "ProjectManager";
let TEAM_MEMBER = "TeamMember";
let CUSTOMER = "Customer";
let CEO = 'CEO';

//KEY VALUES for Project object
let ROLES = 'roles'
let TASKS = 'tasks'
let CHANNELS = 'channels'
let UPDATES = 'updates'
let BOARDS = 'boards'
let NAME = 'name'
let ID = '_id'


//These handlers will be used if you do not provide one to each function
var defaultSuccessHandler = function(data) {
    console.log('Succesfully got back data')
}

var defaultErrorHandler = function(data, error) {
    console.log('data: ' + data + 'Could not be saved! \n')
    console.log('[ERROR]', error)
}

export class ProjectModel extends Parse.Object {



    constructor() {
        //This actually sets the classname
        super('Project')
        //Other initialization

        this.roles = {} // Empty dictionary
        this.set(ROLES, this.roles)

        this.tasks = [] //Empty array of tasks
        this.set(TASKS, this.tasks)

        this.channels = [] //Empty array of channels
        this.set(CHANNELS, this.channels)

        this.updates = [] //Empty array of updates objects
        this.set(UPDATES, this.updates)

        this.boards = [] //Empty array of boards
        this.set(BOARDS, this.boards)


        this.name = "New Project"
        this.set(NAME, this.name)

    }

    //Getters

    getName(){
      return this.get(NAME)
    }

    getRoles() {
        return this.get(ROLES)
    }


    getTasks() {
        return this.get(TASKS)
    }

    getChannels() {
        return this.get(CHANNELS)
    }

    getUpdates() {
        return this.get(UPDATES)
    }

    getBoards() {
        return this.get(BOARDS)
    }

    getName() {
        return this.get(NAME)
    }


    addRole(user, role, successHandler, errorHandler) {
        var roles = this.get(ROLES)
        //(user id) -> role map
        roles[user.id] = role;
        this.set(ROLES, roles)

        this.saveData(this, successHandler, errorHandler)
    }


    removeUserFromRole(user, successHandler, errorHandler) {
        var roles = this.get(ROLES)

        delete roles[user.id]

        this.set(ROLES, roles);

        this.saveData(this, successHandler, errorHandler)
    }


    addNewChannel(channel, successHandler, errorHandler) {
        var channels = this.get(CHANNELS)

        channels.push(channel)

        this.set(CHANNELS)
        this.saveData(this, successHandler, errorHandler)
    }



    addNewUpdate(update, successHandler, errorHandler) {
        var updates = this.get(UPDATES)

        updates.push(update)

        this.set(UPDATES, updates)

        this.saveData(this, successHandler, errorHandler)
    }


    addBoard(board, successHandler, errorHandler) {
        var boards = this.get(BOARDS)
        boards.push(board)

        this.set(BOARDS, boards)

        this.saveData(this, successHandler, errorHandler)

    }

    removeBoardByIndex(index, successHandler, errorHandler) {
        var boards = this.get(BOARDS)
        boards.splice(index, 0)

        this.set(BOARDS, boards)

        this.saveData(this, successHandler, errorHandler)
    }

    removeBoardByBoard(board, successHandler, errorHandler) {

        var boards = this.get(BOARDS)
        boards.filter(function(currBoard) {
            var currBoardId = currBoard.get(ID)
            var boardRemoveId = board.get(ID)

            return currBoardId != boardRemoveId
        })

        this.set(BOARDS, boards)

        this.saveData(this, successHandler, errorHandler)

    }


    renameProject(newName, successHandler, errorHandler) {

        this.set(NAME, newName)
        this.saveData(this, successHandler, errorHandler)
    }

    saveData(pfobject, successHandler, errorHandler) {
        if (successHandler == null || successHandler == undefined) {
            successHandler = this.defaultSuccessHandler
        }

        if (errorHandler == null || errorHandler == undefined) {
            errorHandler = this.defaultErrorHandler
        }

        pfobject.save(null, {
            success: successHandler,
            error: errorHandler
        })
    }

}


Parse.Object.registerSubclass('Project', ProjectModel);
