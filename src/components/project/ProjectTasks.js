import React from "react";

import Board from "react-trello";
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
    Container
} from "reactstrap";

let CustomLaneHeader = props => {
    return <p>{props.title}</p>;
};

export const ProjectTasks = props => {
    return (
        <div style={{ height: "calc(100% - 40px)" }}>
            <Container fluid style={{ height: "100%", padding: 0 }}>
                <Board
                    data={props.data}
                    eventBusHandle={props.eventBusHandle}
                    draggable
                    collapsibleLanes
                    editable
                    onLaneClick={props.onLaneClick}
                    onCardClick={props.onCardClick}
                    customLaneHeader={<CustomLaneHeader />}
                    style={{
                        padding: "30px 0 0 0",
                        backgroundColor: "#fff",
                        fontFamily: "unset",
                        height: "100%",
                        paddingLeft: 15
                    }}
                />
            </Container>

            <Modal isOpen={props.modalOpen} toggle={props.onToggleModal}>
                <ModalHeader toggle={props.onToggleModal}> New Board </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="projectName">Board Name</Label>
                            <Input
                                type="text"
                                name="projectnameinput"
                                id="projectName"
                                placeholder="Enter board name"
                                onChange={props.onBoardNameChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={props.onToggleModal}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={props.onCreateBoard}>
                        Create Board
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};
