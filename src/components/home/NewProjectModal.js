import React from "react";
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Container
} from "reactstrap";
import NewProjectMember from "./NewProjectMember";

const NewProjectModal = props => {
    return (
        <Modal isOpen={props.modalOpen} toggle={props.onToggleModal} size="lg">
            <ModalHeader toggle={this.onToggleModal}> Create New Project </ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="projectName">Project Name</Label>
                        <Input
                            type="text"
                            name="projectnameinput"
                            id="projectName"
                            placeholder="Agility"
                            onChange={props.onHandleNameChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Container fluid>
                            <Row>
                                <Label for="addMembers" style={{ marginRight: 10 }}>
                                    Project Members
                                </Label>
                                <Button
                                    color="primary"
                                    outline
                                    size="sm"
                                    onClick={props.onAddMember}
                                >
                                    Add member
                                </Button>
                            </Row>

                            {props.newMembers.map((member, index) => (
                                <NewProjectMember
                                    name={member.name}
                                    role={member.role}
                                    key={index}
                                    realKey={index}
                                    onNameChange={props.onNameChange}
                                    onRoleChange={props.onRoleChange}
                                    onDelete={props.onDeleteNewMember}
                                />
                            ))}
                        </Container>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={props.onToggleModal}>
                    Cancel
                </Button>
                <Button color="primary" onClick={props.onCreateProject}>
                    Create Project
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default NewProjectModal;
