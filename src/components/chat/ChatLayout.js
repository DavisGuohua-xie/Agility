import React from 'react';

import {ChatMessage} from './ChatMessage';

import styles from '../../styles/ChatLayout.module.css';


/*
 * TODO: This component is expecting a list of messages from ChatPage.js as 'messageList' prop.
 */
const ChatLayout = props => {
    let sidebarVisible = props.sidebarOpen ? '' : styles.hide;

    return (
        <div className={styles.layoutContainer}>
            <div className={`${styles.sidebarContent} ${sidebarVisible}`}>
                <i className={`fas fa-times ${styles.close}`} onClick={props.toggleSidebar}></i>
                <div className={styles.groupChannels}>
                    <p className={styles.channelHeader}>Channels</p>
                    <ul className={styles.channelList}>
                        {props.groups.map(group => <li key={group.id} className={styles.channelItem}>{group.name}</li>)}
                    </ul>
                </div>
                
                <div className={styles.directChannels}>
                    <p className={styles.channelHeader}>Direct Messages</p>
                    <ul className={styles.channelList}>
                        {props.dms.map(group => <li key={group.id} className={styles.channelItem}>{group.name}</li>)}
                    </ul>
                </div>
            </div>
            
            <div className={styles.mainChatContent}>
                <div className={styles.mainChatContainer}>
                    <div>
                        <div className={styles.chatContainerHeader}>
                            <button className={`${styles.toggleBtn} btn`} onClick={props.toggleSidebar}>
                                <i className={`fas fa-bars`}></i>
                            </button>
                            <p>PERSON</p>
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