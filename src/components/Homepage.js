/**
 * Filename: Homepage.js
 * Author: Akshara Balachandra
 * Description: Example functional React component.
 * Date: 04/22/2018
 */
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter, Redirect } from "react-router";
import { projActions } from "../actions/projActions";
//import { Parse } from "parse";
//import { UserModel } from "../models/UserModel";

import { NavBar } from "./common/Navbar";
import { ProjectListComponent } from "./home/ProjectListComponent";

//import v4 from "uuid";

class Homepage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [] // TODO: change to action dispatch
        };

        this.projectClick = this.projectClick.bind(this);
    }

    componentDidMount() {
        console.log("dispatching...");
        if (this.props.logged_in) this.props.actions.getProjects();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.projects !== state.projects) return { projects: props.projects };
        return null;
    }

    projectClick(e) {
        this.props.history.push(`/${e.target.id}/overview`);
        // TODO: dispatch action to reflect current project name in store
    }

    // componentDidMount(){
    //   var currentUser = UserModel.current(()=>{
    //     console.log("[PROJECTLISTCOMPONENTS]",currentUser.getProjects())
    //     this.setState({projects: currentUser.getProjects()})
    //   });

    // }

    render() {
        return this.props.logged_in ? (
            <div>
                <NavBar zIndex={3} />
                <ProjectListComponent
                    projects={this.state.projects}
                    onClick={this.projectClick}
                />{" "}
                {/* TODO: project list will be sent over by server */}
            </div>
        ) : (
            <Redirect to="/login" />
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(projActions, dispatch)
    };
}

function mapStateToProps(state, ownProps) {
    console.log("HOMEPAGE");
    console.log(state);
    return {
        loading: state.ajaxCallsInProgress > 0,
        logged_in: state.authReducer.logged_in,
        projects: state.projectReducer.projects
    };
}

const connectedHomepage = withRouter(connect(mapStateToProps, mapDispatchToProps)(Homepage));
export { connectedHomepage as Homepage };
