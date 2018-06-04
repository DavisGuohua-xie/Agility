import Parse from 'parse'

let TITLE = 'title'
let TASK_LIST = 'task_list'


export class BoardModel extends Parse.Object {
    constructor() {
        super('Board')

        this.title = 'New Board'
        this.set(TITLE, this.title);

        this.task_list = [];
        this.set(TASK_LIST, this.task_list);

    }
    getTitle() {
        return this.get(TITLE)
    }

    getTaskList() {
        return this.get(TASK_LIST)
    }


    updateTitle(newTitle, successHandler, errorHandler) {
        this.set(TITLE, newTitle);
        return saveData(this, successHandler, errorHandler)

    }
    // Pass in a javascript object with fields of task (Not handled by mongoDB)
    addTask(task, successHandler, errorHandler) {
        var taskList = this.get(TASK_LIST)
        taskList.push(task);
        this.set(TASK_LIST, taskList);
        return saveData(this, sucessHandler, errorHandler)

    }

    removeTaskById(task, successHandler, errorHandler) {
        var taskList = this.get(TASK_LIST)
        taskList.filter(function(currTask, index, arr) {
            var currTaskId = currTask.get(ID)
            var taskId = task.get(ID)
            return currTaskId != taskId;
        })
        this.set(TaskModel.TASK_LIST, taskList);
      return  saveData(this, successHandler, errorHandler)
    }


    saveData(pfobject, successHandler, errorHandler) {
        if (successHandler == null || successHandler == undefined) {
            successHandler = this.defaultSuccessHandler
        }

        if (errorHandler == null || errorHandler == undefined) {
            errorHandler = this.defaultErrorHandler
        }

      return  pfobject.save() // Using promises!
    }

}


Parse.Object.registerSubclass('Board', Board);
