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

import Sidebar from 'react-sidebar';

import * as projActions from '../actions/projActions';

import NavBar from './common/Navbar';

import {OverviewSubnav} from './common/OverviewSubnav';
import {ProjectOverview} from './project/ProjectOverview';

const mql = window.matchMedia(`(min-width: 900px)`);

class ProjectOverviewPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: 0,
            sidebarOpen: false,
            mql: mql,
            docked: props.docked,
            open: props.open
        };
        this.setActive = this.setActive.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    }

    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
        this.setState({mql: mql, sidebarDocked: mql.matches});
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
    }

    mediaQueryChanged() {
        this.setState({sidebarDocked: this.state.mql.matches});
    }    

    toggleSidebar(open) {
        this.setState({sidebarOpen: open});
    }

    setActive(e) {
        this.setState({active: e.target.dataset.tab});
    }
    
    //
    render() {
        let sidebarContent = <h1>sidebar!</h1>;
        return (
            <div style={{height: '100%'}}>
                <NavBar projName="Project" />
                <OverviewSubnav active={this.state.active}/>
                <Sidebar sidebar={sidebarContent}
                    open={this.state.sidebarOpen}
                    docked={this.state.sidebarDocked}
                    onSetOpen={this.onSetSidebarOpen}
                    styles={{root: {top: '96px'}}}>
                    
                    <ProjectOverview onSidebarToggle={this.toggleSidebar}/>
                </Sidebar>
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