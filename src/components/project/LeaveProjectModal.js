import React from "react";
import {
    Button,
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
                            Leave
                        </Button>
                    </ModalFooter>
                </Modal>
    )
};

export default LeaveProjectModal;