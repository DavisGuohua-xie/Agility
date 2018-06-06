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
} from "reactstrap";

const LeaveProjectModal = props => {
    return (
        <Modal
                    isOpen={props.leaveProjectModalOpen}
                    toggle={props.toggleLeaveProjectModal}
                    className={props.className}
                >
                    <ModalHeader toggle={props.toggleLeaveProjectModal}>
                        Leave Project
                    </ModalHeader>
                    <ModalBody>
                        Are you sure you want to do this?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={props.toggleLeaveProjectModal}>
                            Cancel
                        </Button>
                        <Button color="primary" onClick={props.handleLeaveProject}>
                            Remove
                        </Button>
                    </ModalFooter>
                </Modal>
    )
};

export default LeaveProjectModal;