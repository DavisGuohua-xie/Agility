import React from "react";

import styles from "../../styles/ChatMessage.module.css";

export const ChatMessage = props => {
    if(!props.message) return null;
    let dateContents = new Date(props.message.createdAt).toLocaleString();
    return (
        <div className={styles.message}>
            <p className={`${styles.from} ${styles.p}`} title={dateContents}>
                {props.message.sender}
            </p>
            <p className={styles.p} title={dateContents}>
                {props.message.text}
            </p>
        </div>
    );
};
