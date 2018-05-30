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
import * as projActions from "../actions/projActions";
import { Parse } from "parse";

import { NavBar } from "./common/Navbar";
import { ProjectListComponent } from "./home/ProjectListComponent";

import v4 from "uuid";

let projs = [
    { name: "Project 1", id: "id1" },
    { name: "Project 2", id: "id2" },
    { name: "Project 3", id: "id3" },
    { name: "Project 4", id: "id4" },
    { name: "Project 5", id: "id5" }
];

class Homepage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: projs // TODO: change to action dispatch
        };

        this.projectClick = this.projectClick.bind(this);
    }

    projectClick(e) {
        this.props.history.push(`/${e.target.id}/overview`);
        // TODO: dispatch action to reflect current project name in store
    }

    render() {
        return this.props.logged_in ? (
            <div>
                <NavBar history={this.props.history} zIndex={3} />
                <ProjectListComponent
                    projects={this.state.projects}
                    onClick={this.projectClick}
                />{" "}
                {/* TODO: project list will be sent over by server */}
            </div>
        ) : <Redirect to="/login"/>;
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(projActions, dispatch)
    };
}

function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
        loading: state.ajaxCallsInProgress > 0,
        logged_in: state.authReducer.logged_in
    };
}

const connectedHomepage = withRouter(connect(mapStateToProps, mapDispatchToProps)(Homepage));
export { connectedHomepage as Homepage };
