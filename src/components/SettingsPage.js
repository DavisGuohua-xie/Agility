import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { accountActions } from "../actions/accountActions";

import { NavBar } from "./common/Navbar";
import SettingsLayout from "./settings/SettingsLayout";
import toastr from "../components/common/toastrConfig";

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

        
    }

    componentDidMount() {
        if (!this.props.logged_in) {
            this.props.history.replace("/login");
            return;
        }
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

        let req = {};

        req.first_name = this.state.fname;
        req.last_name = this.state.lname;
        req.email = this.state.email;

        if (this.state.fname === "" || this.state.lname === "" || this.state.email === "") {
            toastr.error("Required field left blank.", "Saving failed!");
            return;
        }

        if (parseInt(this.state.notification, 10) === -1) {
            toastr.error("Did not select an email frequency.", "Saving failed!");
            return;
        }

        req.notification = this.state.notification;

        if (this.state.password !== this.state.confpassword) {
            toastr.error("Passwords are not the same.", "Saving failed!");
            return;
        }
        req.password = this.state.password;

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
                <SettingsLayout
                    fname={this.state.fname}
                    lname={this.state.lname}
                    email={this.state.email}
                    username={this.state.username}
                    notification={this.state.notification}
                    onValueChange={this.handleChange}
                    onSave={this.handleSave}
                />
            </div>
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
        logged_in: state.authReducer.logged_in,
        loading: state.ajaxCallsInProgress > 0,
        user_info: state.accountReducer.user_info
    };
}

const connectedHomepage = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SettingsPage)
);
export { connectedHomepage as SettingsPage };
