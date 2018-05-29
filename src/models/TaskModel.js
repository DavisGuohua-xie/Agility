import Parse from "parse";

//Task model member fields/ keys
let ASSIGNED_TO = 'assigned_to';
let TITLE = 'title';
let CONTENT = 'content';
let STARTED_AT = 'started_at';
let DUE_DATE = 'due_date';
let COMPLETION_DATE = 'completion_date';
let PRIORITY = 'priority';
let ID = '_id';

//Priority bounds
let MAX_PRIORITY = 10;
let MIN_PRIORITY = 1;


export class TaskModel extends Parse.Object {

    constructor() {
        //Set the db name and init object
        super('Task')

        //Default handlers
        this.defaultSuccessHandler = function(data) {
            console.log('Succesfully got back data');
        }

        this.defaultErrorHandler = function(data, error) {
            console.log('data: ' + data + 'Could not be saved! \n');
            console.log('[ERROR]', error);
        }

        this.assignedTo = [];
        this.set(ASSIGNED_TO, this.assignedTo);

        this.title = 'NewTask';
        this.set(TITLE, this.title);

        this.content = 'Put task content here';
        this.set(CONTENT, this.content);


        this.startedAt = Date.now();
        this.set(STARTED_AT, this.startedAt)

        //By default will put the due date to whenever saved
        this.dueDate = Date.now();
        this.set(DUE_DATE, this.dueDate)

        this.completionDate = Date.now();
        this.set(COMPLETION_DATE, this.completionDate)

        //By default making this min priority.
        this.priority = MIN_PRIORITY;
        this.set(PRIORITY, this.priority);

    }

    //Getters
    getTitle() {
        return this.get(TITLE)
    }

    getContent() {
        return this.get(CONTENT)
    }

    getStartedAt() {
        return this.get(STARTED_AT)
    }

    getDueDate() {
        return this.get(DUE_DATE)
    }

    getCompletionDate() {
        return this.get(COMPLETION_DATE)
    }

    getPriority() {
        return this.get(PRIORITY)
    }


    //Settters
    addAssignedTo(user, successHandler, errorHandler) {
        this.assignedTo.push(user)
        //get actual data
        var actualAssigned = this.get(ASSIGNED_TO)
        actualAssigned.push(user)
        //Modify data
        this.set(ASSIGNED_TO, actualAssigned)
        //Update it
        this.saveData(this, successHandler, errorHandler)
    }



    removeAssignedToByIndex(index, successHandler, errorHandler) {
        //remove the element at this index
        var actualAssigned = this.get(ASSIGNED_TO)
        actualAssigned.splice(index, 1)
        this.set(ASSIGNED_TO, actualAssigned)
        this.saveData(this, successHandler, errorHandler)

    }

    removeAssignedToByUser(user, successHandler, errorHandler) {
        var actualAssigned = this.get(ASSIGNED_TO);
        actualAssigned.filter(function(currentUser) {
            var currentUserId = currentUser.get(ID)
            var removeUserId = user.get(ID)
            return currentUserId != removeUserId
        })

        this.set(ASSIGNED_TO, actualAssigned)
        this.saveData(this, successHandler, errorHandler)
    }


    updateTitle(newTitle, successHandler, errorHandler) {
        this.set(TITLE, newTitle);
        this.saveData(this, successHandler, errorHandler)
    }

    updateContent(newContent, successHandler, errorHandler) {
        this.set(CONTENT, newContent)
        this.saveData(this, successHandler, errorHandler)
    }

    updateDueDate(newDueDate, successHandler, errorHandler) {
        this.set(DUE_DATE, newDueDate)
        this.saveData(this, successHandler, errorHandler)
    }

    upadateCompletionDate(newCompletionDate, sucessHandler, errorHandler) {
        this.set(COMPLETION_DATE, newCompletionDate)
        this.saveData(this, sucessHandler, errorHandler)
    }

    updatePriority(newPriority, successHandler, errorHandler) {

        //Bound the prio
        if (newPriority > MAX_PRIORITY) {
            newPriority = MAX_PRIORITY;
            return;
        } else if (newPriority < MIN_PRIORITY) {
            newPriority = MIN_PRIORITY;
        }
        this.set(PRIORITY, newPriority);
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

Parse.Object.registerSubclass('Task', TaskModel);