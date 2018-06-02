import React, { Component } from "react";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";

import toastr from "./common/toastrConfig";
import { withRouter, Redirect } from "react-router";

import { login, register } from "../actions/authActions";

import {UserModel} from '../models/UserModel'

import LoginForm1 from "./login/LoginForm1";

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            email: "",
            isOpenReg: false,
            isOpenForgot: false,
            loggedIn: false
        };

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
            this.props._login(username, password,
              ()=>{console.log("success");});
        } else {
            toastr.error("Please enter a username and password!", "Login failed");
        }
    }

    handleCreateAccount() {
        let username = this.state.registerUsername;
        let password = this.state.registerPassword;
        let email = this.state.registerEmail;
        let fname = this.state.fname;
        let lname = this.state.lname;

        if (username && password && email) {
            this.props._register(
                username,
                password,
                email,
                fname,
                lname,
                ()=>{this.setState({
                  loggedIn: true
                })}
            );
        }
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
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
      return !this.props.logged_in ?
        (<LoginForm1
            onInputChange={this.handleInputChange}
            onLogin={this.handleLogin}
            onCreateAccount={this.handleCreateAccount}
            onToggleForgot={this.handleToggleForgot}
            isOpenForgot={this.state.isOpenForgot}
            onToggleReg={this.handleToggleReg}
            isOpenReg={this.state.isOpenReg}
            ajaxRequested={this.props.logging_in}
        />) : <Redirect to="/" />;
    }
}

function mapDispatchToProps(dispatch) {
    return {
        _login(username, password, success){
          dispatch(login(username, password, success))
        }
        ,_register(username, pass,email, fname, lname, success){
          dispatch(register(fname, lname, username, email, pass, success))
        }
    };
}

function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
        ajaxCalls: state.ajaxCallsInProgress,
        logging_in: state.authReducer.logging_in,
        logged_in: state.authReducer.logged_in
    };
}

const connectedLoginPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage));
export { connectedLoginPage as LoginPage };
