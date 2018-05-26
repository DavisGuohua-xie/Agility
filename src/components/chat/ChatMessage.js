import React from 'react';

import styles from '../../styles/ChatMessage.module.css';

export const ChatMessage = props => {
    let dateContents = (new Date(props.message.sent_at)).toLocaleString();
    return (
        <div className={styles.message}>
            <p className={`${styles.from} ${styles.p}`} title={dateContents}>{props.message.sent_by_name}</p>
            <p className={styles.p} title={dateContents}>{props.message.message}</p>
        </div>
    );
};