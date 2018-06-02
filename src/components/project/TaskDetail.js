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
    Container
} from "reactstrap";

const TaskDetail = props => {
    return (
        <Modal
            isOpen={props.modalOpen}
            toggle={props.editing ? props.onToggleEditModal : props.onToggleModal}
        >
            <ModalHeader toggle={props.editing ? props.onToggleEditModal : props.onToggleModal}>
                {" "}
                {props.editing ? "Edit Board" : "New Board"}{" "}
            </ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="projectName">Board Name</Label>
                        <Input
                            type="text"
                            name="boardName"
                            id="boardName"
                            placeholder="Enter board name"
                            onChange={props.onBoardNameChange}
                            value={props.boardName}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="secondary"
                    onClick={props.editing ? props.onToggleEditModal : props.onToggleModal}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={props.editing ? props.onSaveBoard : props.onCreateBoard}
                >
                    {props.editing ? "Save Board" : "Create Board"}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default TaskDetail;
