import React, { Component } from "react";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";

import { withRouter } from "react-router";
import toastr from "./common/toastrConfig";

import { authActions } from "../actions/authActions";

import LoginForm1 from "./login/LoginForm1";

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            email: "",
            isOpenReg: false,
            isOpenForgot: false
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
            this.props.actions.login(username, password, this.props.history);
        } else {
            toastr.error("Please enter a username and password!", "Login failed")
        }
    }

    handleCreateAccount() {
        let username = this.state.registerUsername;
        let password = this.state.registerPassword;
        let email = this.state.registerEmail;
        let fname = this.state.fname;
        let lname = this.state.lname;

        if (username && password && email) {
            this.props.actions.register(
                username,
                password,
                email,
                fname,
                lname,
                this.props.history
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
        console.log(this.props.ajaxCalls);
        return (
            <LoginForm1
                onInputChange={this.handleInputChange}
                onLogin={this.handleLogin}
                onCreateAccount={this.handleCreateAccount}
                onToggleForgot={this.handleToggleForgot}
                isOpenForgot={this.state.isOpenForgot}
                onToggleReg={this.handleToggleReg}
                isOpenReg={this.state.isOpenReg}
                ajaxRequested={this.props.logging_in}
            />
        );
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
        ajaxCalls: state.ajaxCallsInProgress,
        logging_in: state.authReducer.logging_in
    };
}

const connectedLoginPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage));
export { connectedLoginPage as LoginPage };
