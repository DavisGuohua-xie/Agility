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
    ModalFooter,
    Container
} from "reactstrap";

import styles from "../../styles/NewChannelModal.module.css";

const SelectedMemberItem = props => {
    return <p className={styles.selectedMember}>{props.username}</p>;
};

const MemberListItem = props => {
    return (
        <div
            className={`${styles.memberItemContainer} ${
                props.active ? styles.memberItemContainerActive : null
            }`}
            data-name={props.username}
            onClick={props.onMemberSelect}
        >
            <p className={styles.memberItemName} data-name={props.username}>
                {props.username}
            </p>
        </div>
    );
};

const MemberList = props => {
    return (
        <div>
            <Label>Selected Members</Label>
            <div>
                {props.selectedMembers.map((member, index) => (
                    <SelectedMemberItem username={member} key={index} />
                ))}
            </div>
            <Label>Project Members</Label>
            {props.members.map((member, index) => (
                <MemberListItem
                    username={member}
                    key={index}
                    onMemberSelect={props.onMemberSelect}
                    active={props.selectedMembers.indexOf(member) >= 0}
                />
            ))}
        </div>
    );
};

const NewChannelModal = props => {
    let headerTitle = props.groupChannel ? "New Group Channel" : "New Private Channel";

    return (
        <Modal isOpen={props.isOpen} toggle={props.onToggleModal}>
            <ModalHeader toggle={props.onToggleModal}>{headerTitle}</ModalHeader>
            <ModalBody>
                <Form onSubmit={props.onCreateChannel}>
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

                    {props.groupChannel ? null : (
                        <MemberList
                            members={props.members}
                            onMemberSelect={props.onMemberClick}
                            selectedMembers={props.selectedMembers}
                        />
                    )}
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
