import React from "react";
import {
    Form,
    Button,
    Input,
    Label,
    FormGroup,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";

const NewChannelModal = props => {
    let headerTitle = props.groupChannel ? "New Group Channel" : "New Private Channel";

    return (
        <Modal isOpen={props.isOpen} toggle={props.onToggleModal}>
            <ModalHeader toggle={props.onToggleModal}>{headerTitle}</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="channelName">Channel Name</Label>
                        <Input
                            type="text"
                            name="channelName"
                            id="channelName"
                            placeholder="Enter channel name"
                            onChange={props.onInputChange}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={props.onToggleModal}>
                    Cancel
                </Button>
                <Button
                    color="primary"
                    data-group={props.groupChannel ? "group" : "private"}
                    onClick={props.onCreateChannel}
                >
                    Create
                </Button>{" "}
            </ModalFooter>
        </Modal>
    );
};

export default NewChannelModal;
