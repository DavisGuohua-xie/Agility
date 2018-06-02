import Parse from "parse";

//Notification levels
let NEVER = 0;
let DAILY = 1;
let HOURLY = 2;

//User member fields/keys
let FIRST_NAME = "first_name";
let LAST_NAME = "last_name";
let PROJECTS = "projects";
let NOTIFICATION = "notification";
let USERNAME = "username";
let PASSWORD = "password";
let EMAIL = "email";
let ID = "_id";
let CURRENT_USER = "current_user";

//Default completion handlers..
var defaultSuccessHandler = function(data) {
    console.log("Succesfully got back data");
};

var defaultErrorHandler = function(data, error) {
    console.log("data: " + data + "Could not be saved! \n");
    console.log("[ERROR]", error);
};

//UserModel does not extends Parse.User but is more like a wrapper
export class UserModel {
    constructor(currentUser) {
        if (!currentUser) {
            //Let the super class be responsible for setting the classname
            this.user = new Parse.User();

            this.firstName = "firstname";
            this.user.set(FIRST_NAME, this.firstName);

            this.lastName = "lastname";
            this.user.set(LAST_NAME, this.lastName);

            this.projects = [];
            this.user.set(PROJECTS, this.projects);

            this.notification = HOURLY;
            this.user.set(NOTIFICATION, this.notification);
        } else {
            this.user = currentUser;
            this.firstName = currentUser.get(FIRST_NAME);
            this.lastName = currentUser.get(LAST_NAME);
            this.projects = currentUser.get(PROJECTS);
            console.log(`IN USERMODEL CONSTRUCTOR:`);
            console.log(this.projects);
            this.notification = currentUser.get(NOTIFICATION);
        }
    }

    getUsername() {
        return this.user.get(USERNAME);
    }

    //Getters
    getNotification() {
        return this.user.get(NOTIFICATION);
    }

    getProjects() {
        let projects = this.user.get(PROJECTS);
        console.log(this.user);

        return projects;
    }

    getLastName() {
        return this.user.get(LAST_NAME);
    }

    getFirstName() {
        return this.user.get(FIRST_NAME);
    }

    getEmail() {
        return this.user.get(EMAIL);
    }

    //Setters/Modifiers

    createAccount(username, password, email = "", successHandler, errorHandler) {
        this.user.set(USERNAME, username);
        this.user.set(PASSWORD, password);
        this.user.set(EMAIL, email);

        this.user.signUp(null, {
            success: successHandler,
            error: errorHandler
        });
    }

    static login(username, password, successHandler, errorHandler) {
        Parse.User.logIn(username, password, {
            success: function(user) {
                var userQuery = new Parse.Query(Parse.User);
                userQuery.equalTo("username", user.get("username"));
                userQuery.include(PROJECTS);
                userQuery.find({
                    success: function(results) {
                        var currUser = results[0];
                        console.log(currUser.get("projects"));
                        var loggedIn = new UserModel();
                        //Set the parse user to be populated object
                        loggedIn.user = currUser;

                        successHandler(loggedIn);
                    },
                    error: function(error) {
                        errorHandler(error);
                    }
                });
            },
            error: errorHandler
        });
    }

    //Will return a model object that has it's data populated with projects
    static current(successHandler, errorHandler) {
        var parseUser = Parse.User.current();

        if (parseUser === null) return null;

        var currentUser = new UserModel();
        //If everything is good then just update currentUser just to be sure.
        currentUser.user = parseUser;
        // //Update local storage for good measure
        // localStorage[CURRENT_USER] = currentUser

        var userQuery = new Parse.Query(Parse.User);
        userQuery.equalTo("username", parseUser.get("username"));
        userQuery.include(PROJECTS);
        userQuery.find({
            success: function(results) {
                var currUser = results[0];
                console.log(results);
                var loggedIn = new UserModel(currUser);
                //Set the parse user to be populated object
                loggedIn.user = currUser;
                //Update local storage
                localStorage[CURRENT_USER] = JSON.stringify(loggedIn);

                //console.log("[loggedin], ", localStorage[CURRENT_USER]);

                successHandler(loggedIn);
            },
            error: function(error) {
                errorHandler(error);
            }
        });

        return currentUser;
    }

    static logout() {
        localStorage.clear();
        return Parse.User.logOut();
    }

    setFirstName(firstName, successHandler, errorHandler) {
        // this.firstName = firstName;
        this.user.set(FIRST_NAME, firstName);
        console.log("setFirstName()");
        this.saveData(this.user, successHandler, errorHandler);
    }

    setLastName(lastName, successHandler, errorHandler) {
        // this.lastName = lastName;

        this.user.set(LAST_NAME, lastName);
        this.saveData(this.user, successHandler, errorHandler);
    }

    setEmail(email, successHandler, errorHandler) {
        // this.lastName = lastName;

        this.user.set(EMAIL, email);
        this.saveData(this.user, successHandler, errorHandler);
    }

    setPass(pass, successHandler, errorHandler) {
        // this.lastName = lastName;

        this.user.set(PASSWORD, pass);
        this.saveData(this.user, successHandler, errorHandler);
    }

    setNotification(freq, successHandler, errorHandler) {
        this.user.set(NOTIFICATION, freq);
        this.saveData(this.user, successHandler, errorHandler);
    }

    addProject(project, successHandler, errorHandler) {
        var projects = this.user.get(PROJECTS);

        projects.push(project);

        this.user.set(PROJECTS, projects);
        this.saveData(this.user, successHandler, errorHandler);
    }

    removeProjectByIndex(index, successHandler, errorHandler) {
        var projects = this.user.get(PROJECTS);
        projects.splice(index, 1);
        this.user.set(PROJECTS, projects);
        this.saveData(this.user, successHandler, errorHandler);
    }

    removeProjectByProject(project, successHandler, errorHandler) {
        var projects = this.get(PROJECTS);

        projects.filter(function(currProject) {
            //Change to ProjectModel.ID
            var currProjectId = currProject.get(ID);
            var projectRemoveId = project.get(ID);
            return currProjectId != projectRemoveId;
        });

        this.user.set(PROJECTS, projects);
        this.saveData(this.user, successHandler, errorHandler);
    }

    changeNotification(newNotification, successHandler, errorHandler) {
        if (newNotification < NEVER) newNotification = NEVER;
        if (newNotification > HOURLY) newNotification = HOURLY;

        this.user.set(NOTIFICATION, newNotification);

        this.saveData(this.user, successHandler, errorHandler);
    }

    saveData(pfobject, successHandler, errorHandler) {
        if (successHandler == null || successHandler == undefined) {
            successHandler = this.defaultSuccessHandler;
        }

        if (errorHandler == null || errorHandler == undefined) {
            errorHandler = this.defaultErrorHandler;
        }

        pfobject.save(null, {
            success: successHandler,
            error: errorHandler
        });
    }
}

Parse.Object.registerSubclass("User", UserModel);
