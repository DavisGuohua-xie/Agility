import React from "react";
import ProjectList from "./ProjectList";
import { projActions } from "../../actions/projActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Parse } from "parse";
import {UserModel} from '../../models/UserModel'

import NewProjectModal from "./NewProjectModal";

const PROJECT_MEMBER = 0;
//const PROJECT_MANAGER = 1;
//const CUSTOMER = 2;
//const CEO = 3;

class ProjectListComponent extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            projItems: props.projects,
            newProjectModalOpen: false,
            newProjectName: "",
            newMembers: [],
            memberNameEmpty: true
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleCreateProject = this.handleCreateProject.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAddMember = this.handleAddMember.bind(this);
        this.handleDeleteNewMember = this.handleDeleteNewMember.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
        this.handleNewProjectNameChange = this.handleNewProjectNameChange.bind(this);     
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.projects !== prevState.projects) {
            return {
                projItems: nextProps.projects
            };
        }
        return null;
    }

    toggleModal() {
        this.setState({
            newProjectModalOpen: !this.state.newProjectModalOpen,
            newMembers: [],
            newProjectName: ""
        });
    }

    handleCreateProject() {
        if (this.state.newProjectName !== "") {
            console.log("project name: " + this.state.newProjectName);

            let projectManager = Parse.User.current();
            this.props.actions.createProject(this.state.newProjectName, projectManager, this.state.newMembers);
        } else {
            console.log("no project name inputted");
        }
    }

    handleNameChange(e) {
        let members = this.state.newMembers;
        let index = parseInt(e.target.name.slice("member".length), 10);
        members[index].name = e.target.value;
        this.setState({ newMembers: members });
    }

    handleRoleChange(e) {
        let members = this.state.newMembers;
        let index = parseInt(e.target.name.slice("role".length), 10);
        members[index].role = parseInt(e.target.value, 10);
        this.setState({ newMembers: members });
    }

    handleAddMember(e) {
        let members = this.state.newMembers;
        members.push({ name: "", role: PROJECT_MEMBER });
        this.setState({
            newMembers: members
        });
    }

    handleDeleteNewMember(e) {
        let index = e.target.id;
        let members = this.state.newMembers;
        members.splice(index, 1);

        this.setState({ newMembers: members });
    }

    handleNewProjectNameChange(e) {
        this.setState({
            newProjectName: e.target.value
        })
    }



    render() {
        return (
            <div>
                <NewProjectModal
                    onToggleModal={this.toggleModal}
                    modalOpen={this.state.newProjectModalOpen}
                    onCreateProject={this.handleCreateProject}
                    onAddMember={this.handleAddMember}
                    newMembers={this.state.newMembers}
                    onDeleteNewMember={this.handleDeleteNewMember}
                    onRoleChange={this.handleRoleChange}
                    onNameChange={this.handleNameChange}
                    onNewProjectNameChange={this.handleNewProjectNameChange}
                />

                <ProjectList
                    projects={this.state.projItems}
                    onNewProject={this.toggleModal}
                    onEnterProject={this.handleEnterProject}
                    onClick={this.props.onClick}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(projActions, dispatch)
    };
}

const connectedProjectListComponent = withRouter(
    connect(null, mapDispatchToProps)(ProjectListComponent)
);
export { connectedProjectListComponent as ProjectListComponent };
