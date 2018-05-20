import Parse from 'parse'



class BoardModel extends Parse.Object {

  className(){
    return 'Board'
  }
   constructor(){
     super(className())


     this.title = 'New Board'
     this.task_list = [];

   }

   updateTitle(newTitle){
     this.title = newTitle
   }

}
