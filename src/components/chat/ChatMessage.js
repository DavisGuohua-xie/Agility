import React from 'react';

import styles from '../../styles/ChatMessage.module.css';

export const ChatMessage = props => {
    let messageClass = props.me === props.message.sent_by ? styles.singleMessage : `${styles.singleMessage} ${styles.darker}`;
    let timeClass = props.me === props.message.sent_by ? styles.timeRight : styles.timeLeft;
    let dateContents = (new Date(props.message.sent_at)).toLocaleString();
    return (
        <div className={messageClass}>
            <p>{props.message.message}</p>
            <span className={timeClass}>{dateContents}</span>
        </div>
    );
};