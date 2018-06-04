import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { accountActions } from "../actions/accountActions";

import { NavBar } from "./common/Navbar";
import SettingsLayout from "./settings/SettingsLayout";
import Parse from "parse";
import {UserModel} from "../models/UserModel";
import { consolidateStreamedStyles } from "styled-components";
class SettingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {        
            fname: "",
            lname: "",
            email: "",
            username: "",
            notification: -1
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);

        var currentUser = Parse.User.current();
        if (!currentUser) {
            this.props.history.push("/login");
        }
    }

    componentDidMount() {
        this.props.actions.getUserInfo();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user_info !== undefined) {
            this.setState({
                fname: nextProps.user_info.first_name,
                lname: nextProps.user_info.last_name,
                email: nextProps.user_info.email,
                username: nextProps.user_info.username,
                notification: nextProps.user_info.notification
            });
        }
    }

    handleSave(e) {
        e.preventDefault();
        console.log("saving...");

        let req = {}

        req.first_name = this.state.fname;
        req.last_name = this.state.lname;
        req.email = this.state.email;
        req.notification = this.state.notification;

        if (this.state.password == this.state.confpassword) {
            req.password = this.state.password;
        } else {
            req.password = '';
        }

        this.props.actions.saveUserInfo(req);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div>
            <NavBar history={this.props.history} />
            <SettingsLayout fname={this.state.fname} lname={this.state.lname} email={this.state.email} username={this.state.username} notification={this.state.notification} onValueChange={this.handleChange} onSave={this.handleSave} />
            </div> //
            );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(accountActions, dispatch)
    };
}

function mapStateToProps(state, ownProps) {
    return {
        loading: state.ajaxCallsInProgress > 0,
        user_info: state.accountReducer.user_info
    };
}

const connectedHomepage = withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsPage));
export { connectedHomepage as SettingsPage };
