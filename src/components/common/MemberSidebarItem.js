import React from "react";
import Avatar from "react-avatar";

import styles from "../../styles/MemberSidebarItem.module.css";

const MemberSidebarItem = ({ fname, lname }) => {
    return (
        <li className={styles.member}>
            <Avatar
                name={fname + " " + lname}
                round={true}
                maxInitials={2}
                size={40}
                textSizeRatio={2}
                style={{ marginRight: 10 }}
            />
            <span className={styles.memberName}>
                {fname} {lname}
            </span>
        </li>
    );
};

export default MemberSidebarItem;
