import React from "react";

import styles from "../../styles/ManagementButton.module.css";

const ManagementButton = props => {
    let showClass = props.show
        ? `${styles.dropdownContent} ${styles.show}`
        : styles.dropdownContent;
    return (
        <div className={styles.dropdown}>
            <button onClick={props.onManageClick} className={styles.dropbtn} title="Project menu">
                <i className="fas fa-bars" />
            </button>
            <div className={showClass}>
                <p>Details</p>
                <p onClick={props.onAddMember}>Add Members</p>
                <p onClick={props.onRemoveMember}>Remove Members</p>
                <p>Export Tasks</p>
                <p onClick={props.onLeaveProject}>Leave Project</p>
            </div>
        </div>
    );
};

export default ManagementButton;
