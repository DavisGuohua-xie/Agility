import React from 'react';

import {
    connect
} from 'react-redux';

import {
    bindActionCreators
} from 'redux';

import {
    withRouter
} from 'react-router';

import * as projActions from '../actions/projActions';

import NavBar from './common/Navbar';

import {OverviewSubnav} from './common/OverviewSubnav';
import {ProjectOverview} from './project/ProjectOverview';

class ProjectOverviewPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: 0,
            sidebarOpen: false
        };
        this.setActive = this.setActive.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    toggleSidebar() {
        this.setState({
            sidebarOpen: !this.state.sidebarOpen
        });
    }

    setActive(e) {
        this.setState({active: e.target.dataset.tab});
    }

    render() {
        return (
            <div style={{height: '100%'}}>
                <NavBar projName="Project" />
                <OverviewSubnav active={this.state.active}/>
                <ProjectOverview onSidebarToggle={this.toggleSidebar}/>
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
        ajaxCalls: state.ajaxCallsInProgress
    }
}

const connectedPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectOverviewPage));
export {
    connectedPage as ProjectOverviewPage
};