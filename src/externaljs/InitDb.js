import Parse from 'parse'

export const dbinit = function (){

  var parsecfg = {
      APP_ID: "myAppId",
      MASTER_KEY:"myMasterKey",
      SERVER_URL:"http://cse110exampleparse.herokuapp.com/parse"
  };


  Parse.initialize(parsecfg.APP_ID)
  Parse.serverURL = parsecfg.SERVER_URL
  Parse.User.logOut()




  //Set up classes
   var User = Parse.Object.extend("User")
   // Parse.Object.registerSubclass('User', User);

   var Project = Parse.Object.extend("Project")
   // Parse.Object.registerSubclass('Project', Project);

   // var project = new Project();
   //
   // project.set('test', "fsd");


   var Board = Parse.Object.extend("Board")
   // Parse.Object.registerSubclass('Board', Board);


   var Task = Parse.Object.extend("Task")
   // Parse.Object.registerSubclass('Task', Task);


   var Channel = Parse.Object.extend("Channel")
   // Parse.Object.registerSubclass('Channel', Channel);



   //Set up mock Users

   var fakeCeo = new User();
   var fakeProjectManager = new User();
   var fakeTeamMember = new User();
   var fakeCustomer = new User();

   var fakeCEOUsername = "TheCEO"
   var fakeProjectManagerUsername ="TheProjectManager"
   var fakeTeamMemberUsername = "TheTeamMember"
   var fakeCustomerUsername = "TheCustomer"

   var securePassword = "ThePasswordBaby"



  fakeCeo.set("username", fakeCEOUsername);
  fakeProjectManager.set("username", fakeProjectManagerUsername);
  fakeTeamMember.set("username", fakeTeamMemberUsername);
  fakeCustomer.set("username", fakeCustomerUsername);

  fakeCeo.set("password", securePassword);
  fakeProjectManager.set("password", securePassword);
  fakeTeamMember.set("password", securePassword);
  fakeCustomer.set("password", securePassword);





  //Sign up users
  fakeCeo.signUp(null, {
    success: function(user){
      console.log("User signup was successful");
      fakeProjectManager.signUp(null, {
        success: function(user){
          console.log("User signup was successful");


          fakeTeamMember.signUp(null, {
            success: function(user){
              console.log("User signup was successful");



              //Tasks mock data

              var fakeTask1 = new Task();
              var fakeTask2 = new Task();
              var fakeTask3 = new Task();

              //All tasks assinged to team member
              fakeTask1.set("assigned_to", [fakeTeamMember])
              fakeTask2.set("assigned_to", [fakeTeamMember])
              fakeTask3.set("assigned_to", [fakeTeamMember])

              fakeTask1.set("title", "Task1");
              fakeTask2.set("title", "Task2");
              fakeTask3.set("title", "Task3");

              fakeTask1.set("content", "This is the default message for task1");
              fakeTask2.set("content", "This is the default message for task2");
              fakeTask3.set("content", "This is the default message for task3");

              fakeTask1.set("started_at", Date.now())
              fakeTask2.set("started_at", Date.now())
              fakeTask3.set("started_at", Date.now())

              fakeTask1.set("due_date", Date.now())
              fakeTask2.set("due_date", Date.now())
              fakeTask3.set("due_date", Date.now())

              fakeTask1.set("completion_date", Date.now())
              fakeTask2.set("completion_date", Date.now())
              fakeTask3.set("completion_date", Date.now())


              fakeTask1.set("priority", 2)
              fakeTask2.set("priority", 3)
              fakeTask3.set("priority", 4)


              //Save each task

              fakeTask1.save(null, {
                success: function(task){
                  console.log("Succesfully created task.")



                  fakeTask2.save(null, {
                    success: function(task){
                      console.log("Succesfully created task.")



                      fakeTask3.save(null, {
                        success: function(task){
                          console.log("Succesfully created task.")



                            //Channel mock data


                            var pmChannel = new Channel();
                            var groupChannel = new Channel();



                            //Pm channel
                            pmChannel.set("isChannel", false);
                            pmChannel.set("participants", [fakeCeo, fakeProjectManager]);

                            pmChannel.set("history", [{
                              "message": "Hello world",
                              "sent_at": Date.now(),
                              "sent_by": fakeCeo
                            },

                            {"message": "What's it to ya punk!",
                             "sent_at": Date.now(),
                             "sent_by": fakeProjectManager}

                            ])
                            //group channel

                            groupChannel.set("isChannel", true)
                            groupChannel.set("participants", [fakeCeo, fakeProjectManager, fakeTeamMember])
                            groupChannel.set("history", [{
                              "message": "Hey",
                              "sent_at": Date.now(),
                              "sent_by": fakeCeo
                            },

                            {"message": "Hi.",
                             "sent_at": Date.now(),
                             "sent_by": fakeProjectManager},

                             {"message": "Hola..",
                              "sent_at": Date.now(),
                              "sent_by": fakeTeamMember}
                            ])



                          var tasks = [fakeTask1, fakeTask2, fakeTask3];


                          groupChannel.save(null, {
                            success: function(channel){
                              console.log("Succesfully saved Channel")




                              pmChannel.save(null, {
                                success: function(channel){
                                  console.log("Succesfully saved Channel")


                                    var channels = [groupChannel, pmChannel]

                                    //Board mock data

                                    var todoBoard = new Board()
                                    var inProgressBoard = new Board()
                                    var finishedBoard = new Board()


                                    todoBoard.set("title","TODO");
                                    inProgressBoard.set("title", "In Progress")
                                    finishedBoard.set("title", "Finished")


                                    todoBoard.set("task_list", [fakeTask1])
                                    inProgressBoard.set("task_list", [fakeTask2])
                                    finishedBoard.set("task_list", [fakeTask3])


                                    todoBoard.save(null,{
                                      success: function(board){




                                        inProgressBoard.save(null,{
                                          success: function(board){





                                              finishedBoard.save(null,{
                                                success: function(board){
                                                  console.log("GOOD SAVE");

                                                  //Put code here Now


                                                    var boards = [todoBoard, inProgressBoard, finishedBoard]

                                                    //Project mock data
                                                    var fakeProject = new Project();

                                                    var userRoleMap = {}

                                                    userRoleMap[fakeCeo.id] = 'CEO'
                                                    userRoleMap[fakeProjectManager.id] = 'ProjectManager'
                                                    userRoleMap[fakeTeamMember.id] = 'TeamMember'
                                                    userRoleMap[fakeCustomer.id] = 'Customer'





                                                    var ceoid = fakeCeo.get('_id')
                                                    var projectmanagerid = fakeProjectManager.get('_id')
                                                    var teammemberid =  fakeTeamMember.get('_id')
                                                    var customerid = fakeCustomer.get('_id')

                                                    fakeProject.set("roles", userRoleMap)


                                                    fakeProject.set("tasks", tasks);

                                                    fakeProject.set("channels", channels)

                                                    fakeProject.set("updates", [{
                                                      from: todoBoard,
                                                      to: inProgressBoard,
                                                      updated_at: Date.now(),
                                                      task: fakeTask2
                                                    }])

                                                    fakeProject.set("boards", boards)


                                                    fakeProject.save(null, {
                                                      success: function(project){
                                                        console.log("GOOD SAVE");
                                                      },
                                                      error: function(error){
                                                        console.log("[ERROR]", error);
                                                      }
                                                    })




                                                },
                                                error: function(obj, error){
                                                  console.log("[ERROR]", error);
                                                }
                                              })






                                            console.log("GOOD SAVE");
                                          },
                                          error: function(obj,error){
                                            console.log("[ERROR]", error);
                                          }
                                        })






                                        console.log("GOOD SAVE");
                                      },
                                      error: function(obj,error){
                                        console.log("[ERROR]", error);
                                      }
                                    })







                                },
                                error: function(obj,error){
                                  console.log("[ERROR]", error)
                                }
                              })





                            },
                            error: function(obj,error){
                              console.log("[ERROR]", error)
                            }
                          })




                        },
                          error: function(task, error){
                            console.log("[ERROR]", error.message)
                          }

                      })






                    },
                      error: function(task, error){
                        console.log("[ERROR]", error.message)
                      }

                  })




                },
                  error: function(task, error){
                    console.log("[ERROR]", error.message)
                  }

              })




            },
            error: function(obj, error){
              console.log("[ERROR]", error)
              alert("Something went wrong!\t", error.message)
            }
          })


        },
        error: function(obj,error){
          console.log("[ERROR]", error)
          alert("Something went wrong!\t", error.message)
        }
      })
    },
    error: function(obj,error){
      console.log("[ERROR]", error)
      alert("Something went wrong!\t", error.message)
    }
  })


}
