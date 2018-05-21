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

import v4 from 'uuid';

import * as projActions from '../actions/projActions';

import {NavBar} from './common/Navbar';

import {OverviewSubnav} from './common/OverviewSubnav';
import {ProjectOverview} from './project/ProjectOverview';
import MemberSidebarItem from './common/MemberSidebarItem';

import styles from '../styles/ProjectOverviewPage.module.css';
import { ProjectTasks } from './project/ProjectTasks';
import {ProjectCalendar} from './project/Calendar';
import moment from 'moment';

import { Parse } from 'parse';

const mql = window.matchMedia(`(min-width: 900px)`);

/* TODO: delete mock proj member data */
const members = [
    {fname: 'Joe', lname: 'Schmo'},
    {fname: 'Joe', lname: 'Schmo'},
    {fname: 'Joe', lname: 'Schasdfasdfamo'},
    {fname: 'Joe', lname: 'Schmo'},
    {fname: 'Joe', lname: 'Schasdfasdfamo'},
    {fname: 'Joe', lname: 'Schmo'},
    {fname: 'Joe', lname: 'Schasdfasdfamo'},
    {fname: 'Joe', lname: 'Schmo'},
    {fname: 'Joe', lname: 'Schasdfasdfamo'},
    {fname: 'Joe', lname: 'Schmo'},
    {fname: 'Joe', lname: 'Schasdfasdfamo'},
    {fname: 'Joe', lname: 'Schmo'},
    {fname: 'Joe', lname: 'Schasdfasdfamo'},
    {fname: 'Joe', lname: 'Schmo'} 
];

const mockTasks = {
    lanes: [{
            id: 'lane1',
            title: 'Planned Tasks',
            label: '2/2',
            cards: [{
                    id: 'Card1',
                    title: 'Write Blog',
                    description: 'Can AI make memes',
                    label: '30 mins'
                },
                {
                    id: 'Card2',
                    title: 'Pay Rent',
                    description: 'Transfer via NEFT',
                    label: '5 mins',
                    metadata: {
                        sha: 'be312a1'
                    }
                }
            ]
        },
        {
            id: 'lane2',
            title: 'Completed',
            label: '0/0',
            cards: []
        }
    ]
}

class ProjectOverviewPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);

        this.state = {
            active: '0',
            sidebarOpen: false,
            mql: mql,
            docked: props.docked,
            open: props.open,
            members: members,
            projectID: props.match.params.projID,
            tasksData: mockTasks, // TODO: fix this later
            eventBus: undefined
        };

        this.setActive = this.setActive.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.generateSidebar = this.generateSidebar.bind(this);
        this.handleNewBoard = this.handleNewBoard.bind(this);
        this.setEventBus = this.setEventBus.bind(this);

        var currentUser = Parse.User.current();
        if (!currentUser) {
            this.props.history.push("/login");
        }
    }

    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
        this.setState({mql: mql, sidebarDocked: mql.matches});
        // TODO: fetch project data from server
        // TODO: call redux action
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
    }

    mediaQueryChanged() {
        this.setState({sidebarDocked: this.state.mql.matches});
    }    

    toggleSidebar(open) {        
        this.setState({sidebarOpen: open ? true : false});
    }

    setActive(e) {
        this.setState({active: e.target.dataset.tab});
    }

    generateSidebar() {
        // TODO: generate list of project members for DM-ing

        return (
            <ul className={styles.sidebarUL}>
                {this.state.members.map( (person, index) => <MemberSidebarItem 
                    fname={person.fname} lname={person.lname} key={index}/>)}
            </ul>
        );
    }

    setEventBus = (handle) => {
        this.setState({eventBus: handle});
    }

    handleNewBoard() {
        let boards = Object.assign({}, this.state.tasksData);
        boards.lanes.push({
            id: v4(),
            title: 'random',
            label: '',
            cards: []
        });

        this.setState({tasksData: boards});
        console.log(this.state.eventBus);
        this.state.eventBus.publish({type: 'UPDATE_LANES', lanes: boards.lanes});
    }

    shouldReceiveNewData = newdata => console.log(newdata);
    
    //
    render() {
        console.log(this.state);
        let sidebarContent = this.generateSidebar();
        let mainContent;
        switch(this.state.active) {
            case '0': 
                mainContent = <ProjectOverview onSidebarToggle={this.toggleSidebar}/>;
                break;
            case '1':
                mainContent = <ProjectTasks onSidebarToggle={this.toggleSidebar} data={this.state.tasksData} eventBus={this.setEventBus}/>;
                break;
            default:
                mainContent = <ProjectCalendar events={[ {
                    startDate: new Date(),
                    endDate: new Date(moment().add(1, "days")),
                    title: "Some title"
                  }]}/>
        }

        return (
            <div style={{height: '100%'}}>
                <NavBar history={this.props.history} projName="Project" projID={this.state.projectID}/>
                <Sidebar sidebar={sidebarContent}
                    open={this.state.sidebarOpen}
                    docked={this.state.sidebarDocked}
                    onSetOpen={this.toggleSidebar}
                    styles={{root: {top: '56px', overflowY: 'auto'}, content: {overflowY: 'auto', height: '100%'}, overlay: {top: '56px'}, sidebar: {backgroundColor: 'white', width: 200, zIndex: 99999}}}>
                    <OverviewSubnav active={this.state.active} onNewBoard={this.handleNewBoard} toggleSidebar={this.toggleSidebar} docked={this.state.sidebarDocked} projID={this.state.projectID} onTabChange={this.setActive}/>
                    {mainContent}
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