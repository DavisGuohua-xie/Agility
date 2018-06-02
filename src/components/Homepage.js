/**
 * Filename: Homepage.js
 * Author: Akshara Balachandra
 * Description: Example functional React component.
 * Date: 04/22/2018
 */
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { projActions } from "../actions/projActions";
import { Parse } from "parse";

import { NavBar } from "./common/Navbar";
import { ProjectListComponent } from "./home/ProjectListComponent";

import v4 from "uuid";

let projs = [
    { name: "Loading...", id: v4() },
];

class Homepage extends React.Component {
    constructor(props) {
        super(props);

        var currentUser = Parse.User.current();
        if (!currentUser) {
            this.props.history.push("/login");
            return;
        }
        
        this.state = {
            projects: projs // TODO: change to action dispatch
        };


        this.projectClick = this.projectClick.bind(this);
    }

    componentDidMount() {
        console.log("dispatching...");
        this.props.actions.getProjects();
    }

    projectClick(e) {
        this.props.history.push(`/${e.target.id}/overview`);
        // TODO: dispatch action to reflect current project name in store
    }

    render() {
        return (
            <div>
                <NavBar history={this.props.history} zIndex={3} />
                <ProjectListComponent
                    projects={ this.props.projects === undefined ? this.state.projects : this.props.projects }
                    onClick={this.projectClick}
                />{" "}
                {/* TODO: project list will be sent over by server */}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(projActions, dispatch)
    };
}

function mapStateToProps(state, ownProps) {
    return {
        projects: state.projectReducer.projects,
        loading: state.ajaxCallsInProgress > 0
    };
}

const connectedHomepage = withRouter(connect(mapStateToProps, mapDispatchToProps)(Homepage));
export { connectedHomepage as Homepage };
