import React from "react";
import { Button, Container } from "reactstrap";
import {ReactLoading} from 'react-loading'

import { ChatMessage } from "./ChatMessage";

import styles from "../../styles/ChatLayout.module.css";
import NewChannelModal from "./NewChannelModal";

/*
 * TODO: This component is expecting a list of messages from ChatPage.js as 'messageList' prop.
 */
const ChatLayout = props => {
    console.log(`docked: ${props.docked}`);
    return props.loading ? (
        <ReactLoading type="bars" color="#357EDD" />
    ) : (
        <div className={styles.layoutContainer}>
            <nav className={`navbar bg-light ${styles.chatContainerHeader}`}>
                <Button
                    style={{ margin: "2px" }}
                    onClick={props.toggleSidebar}
                    hidden={props.docked ? true : null}
                >
                    Chats
                </Button>
                <p style={{ fontSize: "31px", margin: "0 0 0 5px" }}>
                    {props.currentRoom ? props.currentRoom : null}
                </p>
            </nav>
            <Container fluid className={styles.messageContent}>
                {props.messageList.map((msg, index) => <ChatMessage key={index} message={msg} />)}
            </Container>
            <div className={styles.inputArea}>
                <div className="input-group mb-3">
                    <textarea
                        style={{ resize: "none", overflow: "auto" }}
                        rows="2"
                        type="text"
                        className="form-control"
                        placeholder="Enter message"
                        aria-label="Enter message"
                        aria-describedby="basic-addon2"
                        onChange={props.onMessageChange}
                        onSubmit={props.onMessageSend}
                        value={props.messageContent}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-primary"
                            type="button"
                            onClick={props.onSubmit}
                        >
                            Send <i className="fab fa-telegram-plane" />
                        </button>
                    </div>
                </div>
            </div>

            <NewChannelModal
                isOpen={props.isModalOpen}
                onToggleModal={props.onToggleModal}
                onInputChange={props.onInputChange}
                onCreateChannel={props.onCreateChannel}
                groupChannel={props.groupChannel}
                members={props.members}
                onMemberClick={props.onMemberClick}
                selectedMembers={props.selectedMembers}
            />
        </div>
    );
};

export default ChatLayout;
