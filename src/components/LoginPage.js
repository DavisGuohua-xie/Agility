import React, {
    Component
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router';
import {authActions} from '../actions/authActions';

import LoginForm1 from './login/LoginForm1';

export default class LoginPage extends Component {
  
  constructor(props) {
        super(props);
    
        this.state = {
            username: "",
            password: "",
            email: "",
            isOpenReg: false,
            isOpenForgot: false
        }


        this.handleLogin = this.handleLogin.bind(this);
        this.handleCreateAccount = this.handleCreateAccount.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleToggleForgot = this.handleToggleForgot.bind(this);
        this.handleToggleReg = this.handleToggleReg.bind(this);
    }
  
    handleLogin() {
        let username = this.state.username;
        let password = this.state.password;

        if (username && password) {
          this.props.actions.login(username, password, this.props.history);
        }
    }

    handleCreateAccount() {
        let username = this.state.registerUsername;
        let password = this.state.registerPassword;
        let email = this.state.registerEmail;

<<<<<<< HEAD
        if (username && password && email) {
          this.props.actions.register(username, password, email, this.props.history);
        }
=======
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

  handleUsernameChange(e){
    let username = e.target.value;
    this.setState({username: username})
  }

  handlePasswordChange(e){
    let password = e.target.value;
    this.setState({password: password})
  }

  handleEmailChange(e){
    let email = e.target.value;
    this.setState({email: email})
  }




  constructor(props){
    super(props);
    //For getting username and password data
    this.state = {
      username: "",
      password: "",
      email: ""
>>>>>>> origin/authentication
    }

    handleInputChange(e) {
        let value = e.target.value;
        this.setState({
            [e.target.name]: value
        });
    }

    handleToggleReg() {
        this.setState({
            isOpenReg: !this.state.isOpenReg
        });
    }

    handleToggleForgot() {
        this.setState({
            isOpenForgot: !this.state.isOpenForgot
        });
    }

    render() {
        console.log(this.props.ajaxCalls);
        return <LoginForm1 
            onInputChange={this.handleInputChange}
            onLogin={this.handleLogin}
            onCreateAccount={this.handleCreateAccount}
            onToggleForgot={this.handleToggleForgot}
            isOpenForgot={this.state.isOpenForgot}
            onToggleReg={this.handleToggleReg}
            isOpenReg={this.state.isOpenReg}
            ajaxRequested={this.props.ajaxCalls > 0}
          />;
    }
}


function mapDispatchToProps(dispatch) {
  return { 
    actions: bindActionCreators(authActions, dispatch)
  };
}

function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
        ajaxCalls: state.ajaxCallsInProgress
    }
}

const connectedLoginPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage));
export { connectedLoginPage as LoginPage };
