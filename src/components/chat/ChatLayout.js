import React from "react";
import { Button } from "reactstrap";

import { ChatMessage } from "./ChatMessage";

import styles from "../../styles/ChatLayout.module.css";

/*
 * TODO: This component is expecting a list of messages from ChatPage.js as 'messageList' prop.
 */
const ChatLayout = props => {
    console.log(`docked: ${props.docked}`);
    return (
        <div className={styles.layoutContainer}>
            <div className={styles.mainChatContent}>
                <div className={styles.mainChatContainer}>
                    <div>
                        <nav
                            className={`navbar bg-light ${styles.chatContainerHeader}`}
                            style={{ justifyContent: "flex-start" }}
                        >
                            <Button
                                style={{ margin: "2px" }}
                                onClick={props.toggleSidebar}
                                hidden={props.docked ? true : null}
                            >
                                Chats
                            </Button>
                            <p style={{ fontSize: "31px", margin: "0 0 0 5px" }}>PERSON</p>
                        </nav>

                        <div className={styles.messageContent}>
                            {props.messageList.map((msg, index) => (
                                <ChatMessage key={index} message={msg} me={props.me} />
                            ))}
                        </div>
                    </div>
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
                            />
                            <div className="input-group-append">
                                <button className="btn btn-outline-primary" type="button">
                                    Send <i className="fab fa-telegram-plane" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatLayout;
