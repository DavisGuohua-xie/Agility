import Parse from 'parse'





exoprt class TaskModel extends Parse.Object {

  let MAX_PRIORITY = 10;
  let MIN_PRIORITY = 1;

  className (){
    return 'Task'
  }
  constructor(){
    super(className())
    this.assignedTo = [];
    this.title = 'NewTask';
    this.content  ='Put task content here';


    this.startedAt = Date.now();

    //By default will put the due date to whenever saved
    this.dueDate = Date.now();

    this.completionDate = Date.now();

   //By default making this min priority.
    this.priority = MIN_PRIORITY;

  }


//TODO: Adds another person to be assined to the task
  addAssignedTo(){

  }

//TODO: Removed person from the tasks
removeAssignedTo(){

}

//TODO: Implement function for updating the title
updateTitle(newTitle){
    this.title = newTitle
}

//TODO: Implement function for updating the content
updateContent(newContent){
  this.content = newContent
}

//TODO: Implement
updateDueDate(dueDate){
  this.dueDate = dueDate;
}

//TODO: Implement
upadateCompletionDate(newCompletionDate){
  this.completionDate = newCompletionDate;
}

//TODO: Implement
updatePriority(newPriority){

//Bound the prio
  if (newPriority > MAX_PRIORITY){
    this.priority = MAX_PRIORITY;
    return;
  }else if (newPriority < MIN_PRIORITY) {
    this.priority = MIN_PRIORITY;
    return;
  }

  this.priority = newPriority;
}








}
