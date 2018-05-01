import React, {
    Component
} from 'react';
import API from '../api/Api'
import LoginForm1 from './login/LoginForm1';

export default class LoginPage extends Component {


    handleLogin() {
        // alert('user logged in with username: ' + this.state.username + "and password: "  + this.state.password );
        let username = this.state.username;
        let password = this.state.password;

        this.api.login(username, password, function(user) {
            alert("succesfully logged in user: " + user)
        }, function(user, error) {
            alert("cannot sign in user b/c ../ " + error)
        })

    }

    handleCreateAccount() {
        // alert('creating user with username: ' + this.state.username + "and password " + this.state.password);
        let username = this.state.username;
        let password = this.state.password;
        let email = this.state.email;

        this.api.createNewAccount(username, password, email, function(user) {
            alert("created new account!");
        }, function(user, error) {
            alert("Could not create a new account!" + error);
        });
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

    constructor(props) {
        super(props);
        //Will getting username and password data
        this.state = {
            username: "",
            password: "",
            email: "",
            isOpenReg: false,
            isOpenForgot: false
        }

        this.api = new API()

        this.handleLogin = this.handleLogin.bind(this);
        this.handleCreateAccount = this.handleCreateAccount.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleToggleForgot = this.handleToggleForgot.bind(this);
        this.handleToggleReg = this.handleToggleReg.bind(this);
    }


    render() {
        return <LoginForm1 
            onInputChange={this.handleInputChange}
            onLogin={this.handleLogin}
            onCreateAccount={this.handleCreateAccount}
            onToggleForgot={this.handleToggleForgot}
            isOpenForgot={this.state.isOpenForgot}
            onToggleReg={this.handleToggleReg}
            isOpenReg={this.state.isOpenReg}
          />;
    }

}