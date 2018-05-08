import React from 'react';

import styles from '../../styles/ChatMessage.module.css';

export const ChatMessage = props => {
    /*
        TODO: fix this implementation
    */
    //let messageClass = props.otherUser.userid === props.from ? styles.singleMessage : `${styles.singleMessage} ${styles.darker}`;
    //let timeClass = props.otherUser.userid === props.from ? styles.timeRight : styles.timeLeft;
    //let dateContents = (new Date(props.date)).toLocaleString();
    let messageClass;
    let dateContents;
    let timeClass;
    return (
        <div className={messageClass}>
            <p>{props.message_contents}</p>
            <span className={timeClass}>{dateContents}</span>
        </div>
    );
};