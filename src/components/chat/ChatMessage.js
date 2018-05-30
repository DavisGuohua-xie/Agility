import React from "react";

import styles from "../../styles/ChatMessage.module.css";

export const ChatMessage = props => {
    let dateContents = new Date(props.message.createdAt).toLocaleString();
    return (
        <div className={styles.message}>
            <p className={`${styles.from} ${styles.p}`} title={dateContents}>
                {props.message.sender.name}
            </p>
            <p className={styles.p} title={dateContents}>
                {props.message.text}
            </p>
        </div>
    );
};
