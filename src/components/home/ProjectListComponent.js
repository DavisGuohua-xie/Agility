import React from 'react';
import ProjectList from './ProjectList';
import {
    projActions
} from '../../actions/projActions';
import {
    bindActionCreators
} from 'redux';
import {
    connect
} from 'react-redux';
import {
    withRouter
} from 'react-router';
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
import {
    Parse
} from 'parse';

class ProjectListComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projItems: props.projects,
            newProjectModalOpen: false,
            newProjectName: '',
            newProjectMembers: ''
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleCreateProject = this.handleCreateProject.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleMemberChange = this.handleMemberChange.bind(this);
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.projects !== prevState.projects) {
            return {
                projItems: nextProps.projects
            };
        }
        return null;
    }

    toggleModal() {
        this.setState({newProjectModalOpen: !this.state.newProjectModalOpen});
    }

    handleCreateProject() {
        if (this.state.newProjectName !== '') {
            console.log("project name: " + this.state.newProjectName);
            let temp = this.state.newProjectMembers.replace(/ /g,'').split(",");

            console.log(Parse.User.current());
            temp.unshift(Parse.User.current().get("username"));
            this.props.actions.createProject(this.state.newProjectName, temp, this.props.history);
        } else {
            console.log('no project name inputted');
        }
    }

    handleNameChange(e) {
        this.setState({newProjectName: e.target.value});
    }

    handleMemberChange(e) {
        this.setState({newProjectMembers: e.target.value});
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.newProjectModalOpen} toggle={this.toggleModal} className={this.props.className}>
                    <ModalHeader toggle={this.toggleModal}> Create New Project </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="projectName">Project Name</Label>
                                <Input type="text" name="projectnameinput" id="projectName" placeholder="Agility" onChange={this.handleNameChange}/> 
                            </FormGroup>
                            <FormGroup>
                                <Label for="addMembers">Add Members</Label>
                                <Input type="text" name="addmembersinput" id="addMembers" placeholder="username1, username2" onChange={this.handleMemberChange}/> 
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        <Button color="primary" onClick={this.handleCreateProject}>Create Project</Button>
                    </ModalFooter>
                </Modal>
                <ProjectList 
                    projects={this.state.projItems}
                    onNewProject={this.toggleModal}
                    onEnterProject={this.handleEnterProject}
                    onClick={this.props.onClick}
                />
            </div>
        );
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(projActions, dispatch)
    };
}

const connectedProjectListComponent = withRouter(connect(null, mapDispatchToProps)(ProjectListComponent));
export {
    connectedProjectListComponent as ProjectListComponent
};