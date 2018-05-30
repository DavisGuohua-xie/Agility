import React from "react";
import styles from "../../styles/ChatLayout.module.css";

const ChatSidebar = props => {
    let groupChannels = props.channels.filter(channel => !channel.isPrivate);
    let dmChannels = props.channels.filter(channel => channel.isPrivate);

    return (
        <div id="sidebar">
            <div className={styles.groupChannels}>
                <p className={styles.channelHeader}>
                    Group Channels {/*<i className={`fas fa-plus-circle ${styles.plus}`} />*/}
                </p>
                <ul className={styles.channelList}>
                    {groupChannels.map(group => (
                        <li key={group.id} className={styles.channelItem}>
                            {group.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.directChannels}>
                <p className={styles.channelHeader}>
                    Direct Messages {/*<i className={`fas fa-plus-circle ${styles.plus}`} />*/}
                </p>
                <ul className={styles.channelList}>
                    {dmChannels.map(group => (
                        <li key={group.id} className={styles.channelItem}>
                            {group.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChatSidebar;
