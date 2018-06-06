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

const RemoveMemberModal = props => {
    return (
        <Modal
                    isOpen={props.removeMemberModalOpen}
                    toggle={props.toggleRemoveMemberModal}
                    className={props.className}
                >
                    <ModalHeader toggle={props.toggleRemoveMemberModal}>
                        Remove New Team Member
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="usertName">User Name or Email</Label>
                                <Input
                                    type="text"
                                    name="usernameinput"
                                    id="userName"
                                    placeholder="Agility"
                                    onChange={props.onRemoveName}
                                />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={props.toggleRemoveMemberModal}>
                            Cancel
                        </Button>
                        <Button color="primary" onClick={props.onRemoveMember}>
                            Remove
                        </Button>
                    </ModalFooter>
                </Modal>
    )
};

export default RemoveMemberModal;