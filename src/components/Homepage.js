/**
 * Filename: Homepage.js
 * Author: Akshara Balachandra
 * Description: Example functional React component.
 * Date: 04/22/2018
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router';
import * as projActions from '../actions/projActions';
import {Parse} from 'parse';

import NavBar from './common/Navbar';
import ProjectListComponent from './home/ProjectListComponent';

let projs = [
    {name: "Project 1"},
    {name: "Project 2"},
    {name: "Project 3"},
    {name: "Project 4"},
    {name: "Project 5"}
]


class Homepage extends React.Component {

    constructor(props) {
        super(props);

        var currentUser = Parse.User.current();
        if (!currentUser) {
            this.props.history.push("/login");
        }
    }

    render() {
        return (
            <div>
                <NavBar  projName="Project name" history={this.props.history} />
                <ProjectListComponent projects={projs}/> {/* TODO: project list will be sent over by server */}
            </div>
        )
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
        loading: state.ajaxCallsInProgress > 0
    }
}

const connectedHomepage = withRouter(connect(mapStateToProps, mapDispatchToProps)(Homepage));
export { connectedHomepage as Homepage };
