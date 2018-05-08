import React from 'react';

import {ChatMessage} from './ChatMessage';

import styles from '../../styles/ChatLayout.module.css';


/*
 * TODO: This component is expecting a list of messages from ChatPage.js as 'messageList' prop.
 */
const ChatLayout = props => {
    return (
        <div className={styles.layoutContainer}>
            <div className={styles.sidebarContent}>
                <div className={styles.groupChannels}>
                group channels
                </div>
                
                <div className={styles.directChannels}>
                DM channels
                </div>
            </div>
            
            <div className={styles.mainChatContent}>
                <div className={styles.mainChatContainer}>
                    <div>
                        <div className={styles.chatContainerHeader}>
                            PERSON <small>@PERSONusername</small>
                        </div>
                        <div className={styles.messageContent}>
                            {props.messageList.map((msg, index) => <ChatMessage key={index} message={msg}/>)}
                        </div>
                    </div>
                    <div className={styles.inputArea}>
                        <div className="input-group mb-3">
                            <textarea style={{resize: 'none', overflow: 'auto'}} rows='2' type="text" className="form-control" placeholder="Enter message" aria-label="Enter message" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-outline-primary" type="button">
                                    Send <i className="fab fa-telegram-plane"></i>
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