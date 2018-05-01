import React, { Component } from 'react';
import API from '../api/Api'
import LoginForm1 from './login/LoginForm1';

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
    let email = this.state.email;

    this.api.createNewAccount(username, password, email, function(user){
      alert("created new account!");
    }, function(user, error){
      alert("Could not create a new account!" + error);
    });
  }

  handleInputChange(e){
    let value = e.target.value;
    this.setState({[e.target.name]: value});
  }

  handleToggle() {
    this.setState({isOpen: !this.state.isOpen});
  }

  constructor(props){
    super(props);
    //Will getting username and password data
    this.state = {
      username: "",
      password: "",
      email: "",
      isOpen: false
    }

    this.api = new API()

    this.handleLogin = this.handleLogin.bind(this);
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }


    render(){
      return <LoginForm1 
          onInputChange={this.handleInputChange} 
          onLogin={this.handleLogin} 
          onCreateAccount={this.handleCreateAccount} 
          onToggle={this.handleToggle}
          isOpen={this.state.isOpen}
      />;
    }

}
