import Parse from 'parse'

export class TaskModel extends Parse.Object {

//Priority bounds
  let MAX_PRIORITY = 10;
  let MIN_PRIORITY = 1;


//Default handlers
  var defaultSuccessHandler = function(data){
    console.log('Succesfully got back data')
  }

  var defaultErrorHandler = function(data, error){
    console.log('data: ' + data + 'Could not be saved! \n')
    console.log('[ERROR]', error)
  }


//Task model member fields/ keys
static let ASSIGNED_TO = 'assigned_to'
static let TITLE = 'title'
static let CONTENT = 'content'
static let STARTED_AT = 'started_at'
static let DUE_DATE = 'due_date'
static let COMPLETION_DATE = 'completion_date'
static let PRIORITY = 'priority'
static let ID = '_id'

//Databse name
  className (){
    return 'Task'
  }



  constructor(){
    //Set the db name and init object
    super(className())
    this.assignedTo = [];
    this.set(TaskModel.ASSIGNED_TO, this.assignedTo);

    this.title = 'NewTask';
    this.set(TaskModel.TITLE ,this.title)

    this.content  ='Put task content here';
    this.set(TaskModel.CONTENT, this.content)


    this.startedAt = Date.now();
    this.set(TaskModel.STARTED_AT, this.startedAt)

    //By default will put the due date to whenever saved
    this.dueDate = Date.now();
    this.set(TaskModel.DUE_DATE, this.dueDate)

    this.completionDate = Date.now();
    this.set(TaskModel.COMPLETION_DATE, this.completionDate)

   //By default making this min priority.
    this.priority = MIN_PRIORITY;
    this.set(TaskModel.PRIORITY, this.priority)

  }

//Getters
  getTitle(){
    return this.get(TaskModel.TITLE)
  }

  getContent(){
    return this.get(TaskModel.CONTENT)
  }

  getStartedAt(){
    return this.get(TaskModel.STARTED_AT)
  }

  getDueDate(){
    return this.get(TaskModel.DUE_DATE)
  }

  getCompletionDate(){
    return this.get(TaskModel.COMPLETION_DATE)
  }

  getPriority(){
    return this.get(TaskModel.PRIORITY)
  }


//Settters
  addAssignedTo(user, successHandler, errorHandler){
    this.assignedTo.push(user)
    //get actual data
    var actualAssigned = this.get(TaskModel.ASSIGNED_TO)
    actualAssigned.push(user)
//Modify data
    this.set(TaskModel.ASSIGNED_TO, actualAssigned)
   //Update it
    saveData(this, successHandler, errorHandler)
  }



removeAssignedToByIndex(index, successHandler, errorHandler){
  //remove the element at this index
  var actualAssigned = this.get(TaskModel.ASSIGNED_TO)
  actualAssigned.splice(index, 1)
  this.set(TaskModel.ASSIGNED_TO, actualAssigned)
  saveData(this, successHandler, errorHandler)

}

removeAssignedToByUser(user, successHandler, errorHandler){
  var actualAssigned = this.get(TaskModel.ASSIGNED_TO);
  actualAssigned.filter(function(currentUser){
    var currentUserId = currentUser.get(TaskModel.ID)
    var removeUserId = user.get(TaskModel.ID)
    return currenUserId != removeUserId
  })

  this.set(TaskModel.ASSIGNED_TO, actualAssigned)
  saveData(this, successHandler, errorHandler)
}


updateTitle(newTitle, successHandler, errorHandler){
    this.set(TaskModel.TITLE, newTitle);
    saveData(this, successHandler, errorHandler)
}

updateContent(newContent, successHandler, errorHandler){
  this.set(TaskModel.CONTENT, newContent)
  saveData(this, successHandler, errorHandler)
}

updateDueDate(newDueDate, successHandler, errorHandler){
  this.set(TaskModel.DUE_DATE, newDueDate)
  saveData(this, successHandler, errorHandler)
}

upadateCompletionDate(newCompletionDate, sucessHandler, errorHandler){
  this.set(TaskModel.COMPLETION_DATE, newCompletionDate)
  saveData(this, sucessHandler, errorHandler)
}

updatePriority(newPriority, successHandler, errorHandler){

//Bound the prio
  if (newPriority > MAX_PRIORITY){
    newPriority = MAX_PRIORITY;
    return;
  }else if (newPriority < MIN_PRIORITY) {
    newPriority = MIN_PRIORITY;
  }
  this.set(TaskModel.PRIORITY, newPriority);
  saveData(this,successHandler, errorHandler )

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
