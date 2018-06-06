import React from "react";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";

import { withRouter } from "react-router";

import Sidebar from "react-sidebar";

import { projActions } from "../actions/projActions";

import {taskActions} from "../actions/taskActions";

import { NavBar } from "./common/Navbar";

import { OverviewSubnav } from "./common/OverviewSubnav";
import { ProjectOverview } from "./project/ProjectOverview";
import MemberSidebarItem from "./common/MemberSidebarItem";

import styles from "../styles/ProjectOverviewPage.module.css";
import { ProjectTaskComponent } from "./project/ProjectTaskComponent";
import { ProjectCalendar } from "./project/Calendar";
import AddMemberModal from "./project/AddMemberModal";
import RemoveMemberModal from "./project/RemoveMemberModal";
import LeaveProjectModal from "./project/LeaveProjectModal";

import moment from "moment";

import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";

import { Parse } from "parse";
import ManagementButton from "./project/ManagementButton";
import toastr from "./common/toastrConfig";

const mql = window.matchMedia(`(min-width: 900px)`);

class ProjectOverviewPage extends React.Component {
    constructor(props) {
        super(props);

        var currentUser = Parse.User.current();
        if (!currentUser) {
            this.props.history.push("/login");
            return;
        }

        console.log("in project overview page constructor");
        this.state = {
            active: "0",
            sidebarOpen: false,
            mql: mql,
            docked: props.docked,
            open: props.open,
            members: [],
            projectID: props.match.params.projID,
            showManageMenu: false,
            modalOpen: false,
            tasks: {
                lanes: [
                    {
                        id: "0",
                        title: "Please click on overview then tasks again.",
                        cards: []
                    }
                ]
            },
            addMemberModalOpen: false,
            removeMemberModalOpen: false,
            leaveProjectModalOpen: false,
            newUserName: "",
            newRole: "",
            removeName: ""
        };

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.generateSidebar = this.generateSidebar.bind(this);
        this.handleManageClick = this.handleManageClick.bind(this);
        this.toggleNewBoard = this.toggleNewBoard.bind(this);
        this.updateTasks = this.updateTasks.bind(this);
        this.toggleAddMemberModal = this.toggleAddMemberModal.bind(this);
        this.handleNewName = this.handleNewName.bind(this);
        this.handleAddMember = this.handleAddMember.bind(this);
        this.handleNewRole = this.handleNewRole.bind(this);
        this.toggleRemoveMemberModal = this.toggleRemoveMemberModal.bind(this);
        this.handleRemoveMember = this.handleRemoveMember.bind(this);
        this.handleRemoveName = this.handleRemoveName.bind(this);
        this.updateBoard = this.updateBoard.bind(this);
        this.hasAuthority = this.hasAuthority.bind(this);
        this.toggleLeaveProjectModal = this.toggleLeaveProjectModal.bind(this);
        this.handleLeaveProject = this.handleLeaveProject.bind(this);
    }

    componentDidMount() {
        mql.addListener(this.mediaQueryChanged);
        this.setState({ mql: mql, sidebarDocked: mql.matches});
        this.props.actions.getProject(this.props.match.params.projID);
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

    toggleAddMemberModal() {
        this.setState({ addMemberModalOpen: !this.state.addMemberModalOpen });
    }

    handleNewName(e) {
        let name = e.target.value;
        this.setState({
            newUserName: name
        });
        console.log(this.state.newUserName);
    }

    handleAddMember() {
        if (this.state.newUserName === "") toastr.error("Username cannot be empty.");
        else if (this.state.newRole === "") toastr.error("Role cannot be empty!");
        else if (
            this.state.newRole !== "ProjectManager" &&
            this.state.newRole !== "CEO" &&
            this.state.newRole !== "TeamMember" &&
            this.state.newRole !== "Customer"
        )
            toastr.error("Invalid role entered.");
        else {
            this.toggleAddMemberModal();
            let project_id = this.state.projectID;
            let username = this.state.newUserName;
            let new_role = this.state.newRole;
            if (this.hasAuthority(username, project_id) === false) toastr.error("You don't have the authority to add members!");
            else {
                let query = new Parse.Query(Parse.User);
                query.equalTo("username", username);
                query.first().then(user => {
                if (user === undefined) toastr.error("This user doesn't exist!");
                else {
                    var addRequest = this.props.addRequest === undefined ? 0 : this.props.addRequest;
                    this.props.actions.addMember(username, project_id, new_role);
                    console.log(addRequest);
                    this.toggleAddMemberModal();
                }
            });
            }
        }
        console.log(this.props.feedback);
    }

    handleNewRole(e) {
        this.setState({
            newRole: e.target.value
        });
        console.log(this.state.newRole);
    }

    toggleRemoveMemberModal() {
        this.setState({ removeMemberModalOpen: !this.state.removeMemberModalOpen });
    }

    handleRemoveName(e) {
        this.setState({
            removeName: e.target.value
        });
    }

    handleRemoveMember() {
        let username = this.state.removeName;
        let project_id = this.state.projectID;
        let query = new Parse.Query(Parse.User);
        if (this.hasAuthority(username, project_id) === false) toastr.error("You don't have the authority to remove members!");
        else {
            query.equalTo("username", username);
            query.first().then(user => {
            if (user === undefined) toastr.error("This user doesn't exist!");
            else {
                var user_valid = false;
                let members = this.props.project_data.members;
                for (var i = 0; i < members.length; i++) {
                    console.log(members[i]);
                    if (members[i].username === username) {
                        user_valid = true;
                        break;
                    }
                }
                if (!user_valid) toastr.error("This user is not a member of this project!");
                else {
                    this.toggleRemoveMemberModal();
                    var removeRequest = this.props.removeRequest === undefined ? 0 : this.props.removeRequest;
                    this.props.actions.removeMember(username, project_id);
                    console.log(removeRequest);
                }
            }
        })
        }
        
    }

    hasAuthority(username, project_id) {
        let query = new Parse.Query(Parse.User);
        query.equalTo("username", username);
        query.first().then(user => {
            let query = new Parse.Query(Parse.Object.extend("Project"));
            query.equalTo("objectId", project_id);
            query.first().then(project => {
                let roles = project.get("roles");
                console.log(roles[user.id]);
                if (roles[user.id] === "ProjectManager" || roles[user.id] === "CEO") {
                    console.log("here");
                    return true;
                }
                else return false;
            })
        });
    }

    toggleLeaveProjectModal() {
        this.setState({
            leaveProjectModalOpen: !this.state.leaveProjectModalOpen
        });
    }

    handleLeaveProject() {
        let currentUser =  Parse.User.current();
        this.props.member_actions.removeMember(currentUser.get("username"), this.state.projectID);
        this.toggleLeaveProjectModal();
        this.props.history.push("/");
        toastr.success("You have left the project.");
    }

    mediaQueryChanged() {
        this.setState({ sidebarDocked: this.state.mql.matches });
    }

    toggleSidebar(open) {
        this.setState({ sidebarOpen: open ? true : false });
    }

    generateSidebar() {
        // TODO: generate list of project members for DM-ing

        var members = this.props.project_data === undefined ? [] : this.props.project_data.members;

        return (
            <ul className={styles.sidebarUL}>
                {members.map((person, index) => (
                    <MemberSidebarItem
                        fname={person.fname}
                        lname={person.lname}
                        onSidebarMemberClick={this.handleSidebarMemberClick}
                        username={person.username}
                        key={index}
                    />
                ))}
            </ul>
        );
    }

    handleSidebarMemberClick(e) {
        console.log("i clicked ", e.target.dataset.username);
    }

    updateTasks(newData) {
        this.setState({ tasks: newData });
    }

    updateBoard(boardId, newBoard) {
        // Need to update board "type"! How?
        //board.save();
        console.log(boardId, newBoard);
        this.props.taskActions.updateBoard(boardId, newBoard);
    }

    updateTask(taskId, newTask) {
        console.log(taskId, newTask);
        this.props.taskActions.updateTask(taskId, newTask);
    }

    toggleNewBoard() {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    }

    shouldReceiveNewData = newdata => console.log(newdata);

    handleManageClick = () => this.setState({ showManageMenu: !this.state.showManageMenu });

    render() {
        let task_list =
            this.props.board_data === undefined
                ? { lanes: [] }
                : { lanes: JSON.parse(JSON.stringify(this.props.board_data)) };
        console.log(task_list);

        //console.log(this.state);
        let sidebarContent = this.generateSidebar();
        let mainContent;
        let projectManage = null;
        switch (this.props.match.params.projPage) {
            case "overview":
                mainContent = (
                    <ProjectOverview
                        onSidebarToggle={this.toggleSidebar}
                        taskList={task_list.lanes}
                    />
                );
                projectManage = (
                    <ManagementButton
                        onManageClick={this.handleManageClick}
                        show={this.state.showManageMenu}
                        onAddMember={this.toggleAddMemberModal}
                        onRemoveMember={this.toggleRemoveMemberModal}
                        onLeaveProject={this.toggleLeaveProjectModal}
                    />
                );
                break;
            case "tasks":
                mainContent = (
                    <ProjectTaskComponent
                        onSidebarToggle={this.toggleSidebar}
                        taskList={task_list}
                        eventBus={this.setEventBus}
                        onLaneClick={this.handleLaneClick}
                        onCardClick={this.handleCardClick}
                        modalOpen={this.state.modalOpen}
                        onToggleModal={this.toggleNewBoard}
                        updateBoard={this.updateBoard}
                        updateTasks={this.updateTasks}
                        project_id={this.props.match.params.projID}
                        boards={this.props.board_data}
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
                <Modal
                    isOpen={this.state.addMemberModalOpen}
                    toggle={this.toggleAddMemberModal}
                    className={this.props.className}
                    onNewName={this.handleNewName}
                    onNewRole={this.handleNewRole}
                    onAddMember={this.handleAddMember}
                />
                <RemoveMemberModal 
                    removeMemberModalOpen={this.state.removeMemberModalOpen}
                    toggleRemoveMemberModal={this.toggleRemoveMemberModal}
                    className={this.props.className}
                    onRemoveName={this.handleRemoveName}
                    onRemoveMember={this.handleRemoveMember}
                />
                <LeaveProjectModal 
                    leaveProjectModalOpen={this.state.leaveProjectModalOpen}
                    toggleLeaveProjectModal={this.toggleLeaveProjectModal}
                    className={this.props.className}
                    handleLeaveProject={this.handleLeaveProject}
                />

                <NavBar
                    projName={
                        this.props.project_data === undefined ? "" : this.props.project_data.name
                    }
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
        actions: bindActionCreators(projActions, dispatch),
        taskActions: bindActionCreators(taskActions, dispatch)
    };
}

function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
        ajaxCalls: state.ajaxCallsInProgress,
        project_data: state.projectReducer.project_data,
        board_data: state.taskReducer.board_data,
    };
}

const connectedPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectOverviewPage));
export { connectedPage as ProjectOverviewPage };
