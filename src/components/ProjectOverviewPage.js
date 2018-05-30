import React from "react";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";

import { withRouter } from "react-router";

import Sidebar from "react-sidebar";

import * as projActions from "../actions/projActions";

import { NavBar } from "./common/Navbar";

import { OverviewSubnav } from "./common/OverviewSubnav";
import { ProjectOverview } from "./project/ProjectOverview";
import MemberSidebarItem from "./common/MemberSidebarItem";

import styles from "../styles/ProjectOverviewPage.module.css";
import ProjectTaskComponent from "./project/ProjectTaskComponent";
import { ProjectCalendar } from "./project/Calendar";
import moment from "moment";

import { Parse } from "parse";
import ManagementButton from "./project/ManagementButton";

const mql = window.matchMedia(`(min-width: 900px)`);

/* TODO: delete mock proj member data */
const members = [{ fname: "Joe", lname: "Schmo" }, { fname: "Joe", lname: "Schmo" }];
const mockTasks = {
    lanes: [
        {
            id: "0",
            title: "Planned Tasks",
            label: "2/2",
            cards: [
                {
                    id: "Card1",
                    title: "Write Blog",
                    description: "Can AI make memes",
                    label: "30 mins"
                },
                {
                    id: "Card2",
                    title: "Pay Rent",
                    description: "Transfer via NEFT",
                    label: "5 mins",
                    metadata: {
                        sha: "be312a1"
                    }
                }
            ]
        },
        {
            id: "1",
            title: "Completed",
            label: "0/0",
            cards: []
        }
    ]
};

class ProjectOverviewPage extends React.Component {
    constructor(props) {
        super(props);

        var currentUser = Parse.User.current();
        if (!currentUser) {
            this.props.history.push("/login");
        }

        console.log("in project overview page constructor");
        this.state = {
            active: "0",
            sidebarOpen: false,
            mql: mql,
            docked: props.docked,
            open: props.open,
            members: members,
            projectID: props.match.params.projID,
            showManageMenu: false,
            modalOpen: false,
            tasks: mockTasks
        };

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.generateSidebar = this.generateSidebar.bind(this);
        this.handleManageClick = this.handleManageClick.bind(this);
        this.toggleNewBoard = this.toggleNewBoard.bind(this);
        this.updateTasks = this.updateTasks.bind(this);
    }

    componentDidMount() {
        mql.addListener(this.mediaQueryChanged);
        this.setState({ mql: mql, sidebarDocked: mql.matches });
        // TODO: fetch project data from server
        // TODO: call redux action
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let newActive;
        switch (nextProps.match.params.projPage) {
            case "overview":
                newActive = "0";
                break;
            case "tasks":
                newActive = "1";
                break;
            case "calendar":
                newActive = "2";
                break;
            default:
                break; // should never happen
        }

        return prevState.active !== newActive ? { active: newActive } : null;
    }

    mediaQueryChanged() {
        this.setState({ sidebarDocked: this.state.mql.matches });
    }

    toggleSidebar(open) {
        this.setState({ sidebarOpen: open ? true : false });
    }

    generateSidebar() {
        // TODO: generate list of project members for DM-ing

        return (
            <ul className={styles.sidebarUL}>
                {this.state.members.map((person, index) => (
                    <MemberSidebarItem fname={person.fname} lname={person.lname} key={index} />
                ))}
            </ul>
        );
    }

    updateTasks(newData) {
        this.setState({tasks: newData});
    }

    toggleNewBoard() {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    }

    shouldReceiveNewData = newdata => console.log(newdata);

    handleManageClick = () => this.setState({ showManageMenu: !this.state.showManageMenu });

    render() {
        console.log(this.state);
        let sidebarContent = this.generateSidebar();
        let mainContent;
        let projectManage = null;
        switch (this.props.match.params.projPage) {
            case "overview":
                mainContent = (
                    <ProjectOverview
                        onSidebarToggle={this.toggleSidebar}
                        taskList={this.state.tasks.lanes}
                    />
                );
                projectManage = (
                    <ManagementButton
                        onManageClick={this.handleManageClick}
                        show={this.state.showManageMenu}
                    />
                );
                break;
            case "tasks":
                mainContent = (
                    <ProjectTaskComponent
                        onSidebarToggle={this.toggleSidebar}
                        taskList={this.state.tasks}
                        eventBus={this.setEventBus}
                        onLaneClick={this.handleLaneClick}
                        onCardClick={this.handleCardClick}
                        modalOpen={this.state.modalOpen}
                        onToggleModal={this.toggleNewBoard}
                        updateTasks={this.updateTasks}
                    />
                );
                break;
            case "calendar":
                mainContent = (
                    <ProjectCalendar
                        events={[
                            {
                                startDate: new Date(),
                                endDate: new Date(moment().add(0, "days")),
                                title: "Some title"
                            }
                        ]}
                    />
                );
                break;
            default:
                break; // should never happen
        }

        return (
            <div style={{ height: "100%" }}>
                <NavBar
                    history={this.props.history}
                    projName="Project"
                    projID={this.state.projectID}
                    zIndex={2}
                />
                <Sidebar
                    sidebar={sidebarContent}
                    open={this.state.sidebarOpen}
                    docked={this.state.sidebarDocked}
                    onSetOpen={this.toggleSidebar}
                    styles={{
                        root: { top: "56px", overflowY: "auto" },
                        content: { overflowY: "auto", height: "100%" },
                        overlay: { top: "56px" },
                        sidebar: { backgroundColor: "white", width: 200, zIndex: 99999 }
                    }}
                >
                    <OverviewSubnav
                        active={this.state.active}
                        onNewBoard={this.toggleNewBoard}
                        toggleSidebar={this.toggleSidebar}
                        docked={this.state.sidebarDocked}
                        projID={this.state.projectID}
                    />
                    {projectManage}
                    {mainContent}
                </Sidebar>
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
    console.log(state);
    return {
        ajaxCalls: state.ajaxCallsInProgress
    };
}

const connectedPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectOverviewPage));
export { connectedPage as ProjectOverviewPage };
