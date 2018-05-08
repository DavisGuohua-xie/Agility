import React from 'react';

import styles from '../../styles/ChatLayout.module.css';

const ChatLayout = props => {
    return (
        <div className={styles.layoutContainer}>
            <div className={styles.sidebarContent}>
                <div className={styles.groupChannels}>
                </div>
                
                <div className={styles.directChannels}>
                </div>
            </div>
            
            <div className={styles.mainChatContent}>
                <div className={styles.mainChatContainer}>
                    <div>
                        <div className={styles.chatContainerHeader}>
                            header
                        </div>
                        <div className={styles.messageContent}>
                            message content
                        </div>
                    </div>
                    <div className={styles.inputArea}>
                        <input type='text'/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatLayout;