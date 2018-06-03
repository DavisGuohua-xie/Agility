import React from "react";
import Avatar from "react-avatar";

import styles from "../../styles/MemberSidebarItem.module.css";

const MemberSidebarItem = props => {
    return (
        <li className={styles.member} onClick={props.onSidebarMemberClick} data-username={props.username}>
            <Avatar
                name={props.fname + " " + props.lname}
                round={true}
                maxInitials={2}
                size={40}
                textSizeRatio={2}
                style={{ marginRight: 10 }}
            />
            <span className={styles.memberName} data-username={props.username}>
                {props.fname} {props.lname}
            </span>
        </li>
    );
};

export default MemberSidebarItem;
