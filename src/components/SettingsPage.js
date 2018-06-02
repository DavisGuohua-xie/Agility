import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import * as accountActions from "../actions/accountActions";

import { NavBar } from "./common/Navbar";
import SettingsLayout from "./settings/SettingsLayout";
import Parse from "parse";
import {UserModel} from "../models/UserModel";
class SettingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // TODO: set initial user info here from redux store (props)
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);

        var currentUser = Parse.User.current();
        if (!currentUser) {
            this.props.history.push("/login");
        }
    }

    handleSave(e) {
        e.preventDefault();
        // TODO: save logic here
        console.log("saving...");
        console.log();
        var um = new UserModel();
        // um.current()
        um.user = Parse.User.current();
        var firstName = this.state.fname
        var lastName = this.state.lname
        var email = this.state.email
        var password = this.state.password
        var passwordConf = this.state.confpassword
        var emailFreq = this.state.emailFreq
        if (firstName){
            um.setFirstName(firstName,function(){
                console.log("firstName updated",um.getFirstName())
            }, function(title, error){
               console.log('[ERROR] ', error)
           }) 
        }

        if(lastName){
            um.setLastName(lastName, function(){
                console.log("lastName updated",um.getLastName())
            },
            function(title, error){
                console.log('ERROR', error)
            })
        }

        if(email){
            um.setEmail(email, function(){
                console.log("email updated",um.getEmail())
            },
            function(title, error){
                console.log('ERROR', error)
            })
        }

        if(password) {
            if(password == passwordConf){
                um.setPass(password, function(){
                    console.log("password updated")
                },
                function(title, error){
                    console.log('ERROR', error)
                })
            }
        }

        if(emailFreq){
            um.setNotification(parseInt(emailFreq), function(){
                console.log("frequency updated",um.getNotification())
            },
            function(title, error){
                console.log('ERROR', error)
            })
        }




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
            <SettingsLayout onValueChange={this.handleChange} onSave={this.handleSave} />
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
    console.log(state);
    return {
        loading: state.ajaxCallsInProgress > 0
        // TODO: map user info from state into this component's props
    };
}

const connectedHomepage = withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsPage));
export { connectedHomepage as SettingsPage };
