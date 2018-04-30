import React, { Component } from 'react';
import API from '../api/Api'


export default class LoginPage extends Component {


  handleLogin(){
    // alert('user logged in with username: ' + this.state.username + "and password: "  + this.state.password );
    let username = this.state.username;
    let password = this.state.password;

    this.api.login(username, password, function(user){
      alert("succesfully logged in user: " + user)
    }, function(user, error){
      alert("cannot sign in user b/c ../ " + error)
    })

  }

  handleCreateAccount(){
     // alert('creating user with username: ' + this.state.username + "and password " + this.state.password);
    let username = this.state.username;
    let password = this.state.password;

    this.api.createNewAccount(username, password, function(user){
      alert("created new account!");
    }, function(user, error){
      alert("Could not create a new account!" + error);
    });
  }

  handleUsernameChange(e){
    let username = e.target.value;
    this.setState({username: username})
  }

  handlePasswordChange(e){
    let password = e.target.value;
    this.setState({password: password})
  }




  constructor(props){
    super(props);
    //For getting username and password data
    this.state = {
      username: "",
      password: ""
    }

    this.api = new API()

    this.handleLogin = this.handleLogin.bind(this);
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

  }




     render(){
       return (
         <div>
          <h1>Login Page</h1>
          <form>
             Username: <input onChange={this.handleUsernameChange} type="text"/><br></br>
             Password: <input onChange={this.handlePasswordChange}type="text"/><br></br>
          </form>

          <button onClick={this.handleLogin}>Login </button>
          <button onClick={this.handleCreateAccount}>Create Account</button>

         </div>)
     }

}
