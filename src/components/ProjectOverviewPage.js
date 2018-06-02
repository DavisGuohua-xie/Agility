import React from "react";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";

import { withRouter } from "react-router";

import Sidebar from "react-sidebar";

import { projActions } from "../actions/projActions";

import { NavBar } from "./common/Navbar";

import { OverviewSubnav } from "./common/OverviewSubnav";
import { ProjectOverview } from "./project/ProjectOverview";
import MemberSidebarItem from "./common/MemberSidebarItem";

import styles from "../styles/ProjectOverviewPage.module.css";
import { ProjectTaskComponent } from "./project/ProjectTaskComponent";
import { ProjectCalendar } from "./project/Calendar";
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
} from 'reactstrap';

import { Parse } from "parse";
import ManagementButton from "./project/ManagementButton";

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
            tasks: {lanes: []}
            addMemberModalOpen: false,
            removeMemberModalOpen: false,
            newUserName: '',
            newRole: '',
            removeName: ''
        };

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.generateSidebar = this.generateSidebar.bind(this);
        this.handleManageClick = this.handleManageClick.bind(this);
        this.toggleNewBoard = this.toggleNewBoard.bind(this);
        this.toggleAddMemberModal = this.toggleAddMemberModal.bind(this);
        this.handleNewName = this.handleNewName.bind(this);
        this.handleAddMember = this.handleAddMember.bind(this);
        this.handleNewRole = this.handleNewRole.bind(this);
        this.toggleRemoveMemberModal = this.toggleRemoveMemberModal.bind(this);
        this.handleRemoveMember = this.handleRemoveMember.bind(this);
        this.handleRemoveName = this.handleRemoveName.bind(this);
    }

    toggleAddMemberModal() {
        console.log(Parse.User.current().id);
        this.setState({addMemberModalOpen: !this.state.addMemberModalOpen});
    }

    handleNewName(e) {
        let name = e.target.value;
        this.setState ({
            newUserName: name
        });
        console.log(this.state.newUserName);
    }

    handleAddMember() {
        let newMember = {
            fname: this.state.newUserName,
            lname: this.state.newUserName
        }

        this.state.members.push(newMember);
        this.toggleAddMemberModal();
    }

    handleNewRole(e) {
        this.setState({
            newRole: e.target.value
        }) ;
        console.log(this.state.newRole);
    }

    toggleRemoveMemberModal() {
        this.setState({removeMemberModalOpen: !this.state.removeMemberModalOpen});
    }

    handleRemoveName(e) {
        this.setState({
            removeName: e.target.value
        });
        console.log(this.state.removeName);
    }

    handleRemoveMember() {
        let newMembers = this.state.members;
        console.log(newMembers);
        for (var i = newMembers.length-1; i >= 0; i--) {
            if (newMembers[i].fname == this.state.removeName || newMembers[i].lname == this.state.removeName) {
                newMembers.splice(i, 1);
                break;
            }
        }
        this.setState({
            members: newMembers
        });
    }

    componentDidMount() {
        mql.addListener(this.mediaQueryChanged);
        this.setState({ mql: mql, sidebarDocked: mql.matches });
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

    mediaQueryChanged() {
        this.setState({ sidebarDocked: this.state.mql.matches });
    }

    toggleSidebar(open) {
        this.setState({ sidebarOpen: open ? true : false });
    }

    generateSidebar() {
        // TODO: generate list of project members for DM-ing

        var members = this.props.project_data === undefined ? this.state.members : this.props.project_data.members;

        return (
            <ul className={styles.sidebarUL}>
                {members.map((person, index) => (
                    <MemberSidebarItem fname={person.fname} lname={person.lname} key={index} />
                ))}
            </ul>
        );
    }

    toggleNewBoard() {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    }

    shouldReceiveNewData = newdata => console.log(newdata);

    handleManageClick = () => this.setState({ showManageMenu: !this.state.showManageMenu });

    render() {
        var task_list = this.props.project_data === undefined ? this.state.tasks : { lanes: JSON.parse(JSON.stringify(this.props.project_data.boards)) };
        console.log(task_list);
        
        console.log(this.state);
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
                        project_id={this.props.match.params.projID}
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
                <Modal isOpen={this.state.addMemberModalOpen} toggle={this.toggleAddMemberModal} className={this.props.className}>
                    <ModalHeader toggle={this.toggleAddMemberModal}>Add New Team Member</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="usertName">User Name or Email</Label>
                                <Input type="text" name="usernameinput" id="userName" placeholder="Agility" onChange={this.handleNewName}/>
                                <Label for="role">Role</Label>
                                <Input type="text" name="role" id="role" placeholder="Software Architect, Algorithm Specialist, etc." onChange={this.handleNewRole}/>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleAddMemberModal}>Cancel</Button>
                        <Button color="primary" onClick={this.handleAddMember}>Add</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.removeMemberModalOpen} toggle={this.toggleRemoveMemberModal} className={this.props.className}>
                    <ModalHeader toggle={this.toggleRemoveMemberModal}>Remove New Team Member</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="usertName">User Name or Email</Label>
                                <Input type="text" name="usernameinput" id="userName" placeholder="Agility" onChange={this.handleRemoveName}/>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleRemoveMemberModal}>Cancel</Button>
                        <Button color="primary" onClick={this.handleRemoveMember}>Remove</Button>
                    </ModalFooter>
                </Modal>

                <NavBar
                    projName={this.props.project_data === undefined ? "" : this.props.project_data.name}
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
    return {
        ajaxCalls: state.ajaxCallsInProgress,
        project_data: state.projectReducer.project_data,
        board_data: state.taskReducer.board_data
    };
}

const connectedPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectOverviewPage));
export { connectedPage as ProjectOverviewPage };
