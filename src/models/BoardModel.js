import Parse from 'parse'



export class BoardModel extends Parse.Object {


  static let TITLE = 'title'
  static let TASK_LIST = 'task_list'

  className(){
    return 'Board'
  }
   constructor(){
     super(className())


     this.title = 'New Board'
     this.set(BoardModel.TITLE, this.title);

     this.task_list = [];
     this.set(BoardModel.TASK_LIST, this.task_list);

   }


   getTitle(){
     return this.get(BoardModel.TITLE)
   }

   getTaskList(){
     return this.get(BoardModel.TASK_LIST)
   }


   updateTitle(newTitle, successHandler, errorHandler){
     this.set(BoardModel.TITLE, newTitle);
     saveData(this,successHandler, errorHandler)

   }
// Pass in a javascript object with fields of task (Not handled by mongoDB)
   addTask(task, successHandler, errorHandler){
      var taskList = this.get(BoardModel.TASK_LIST)
      taskList.push(task);
      this.set(BoardModel.TASK_LIST, taskList);
      saveData(this, sucessHandler, errorHandler)

   }

   removeTaskById(task, successHandler, errorHandler){
     var taskList = this.get(BoardModel.TASK_LIST)
     taskList.filter(function(currTask, index, arr){
       var currTaskId = currTask.get(BoardModel.ID)
       var taskId = task.get(BoardModel.ID)
       return currTaskId != taskId;
     })
     this.set(TaskModel.TASK_LIST, taskList);
     saveData(this, successHandler, errorHandler)
   }


   saveData(pfobject, successHandler, errorHandler){
    if (successHandler == null || successHandler == undefined) {
      successHandler = this.defaultSuccessHandler
    }

    if (errorHandler == null || errorHandler == undefined){
      errorHandler = this.defaultErrorHandler
    }

        pfobject.save(null, successHandler, errorHandler) // Using promises!
   }

}
