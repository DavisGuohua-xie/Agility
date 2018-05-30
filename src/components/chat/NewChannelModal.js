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
        <Modal isOpen={props.isOpen} toggle={props.onToggle}>
            <ModalHeader toggle={props.onToggleForgot}>{headerTitle}</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="recoverUsername">Email address</Label>
                        <Input
                            type="email"
                            name="recoverUsername"
                            id="recoverUsername"
                            placeholder="Email address"
                            onChange={props.onInputChange}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={props.onToggleForgot}>
                    Cancel
                </Button>
                <Button color="primary" onClick={props.onPasswordReset}>
                    Send reset link
                </Button>{" "}
            </ModalFooter>
        </Modal>
    );
};

export default NewChannelModal;
