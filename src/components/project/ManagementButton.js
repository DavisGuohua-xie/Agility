import React from "react";

import styles from "../../styles/ManagementButton.module.css";

const ManagementButton = props => {
    let showClass = props.show
        ? `${styles.dropdownContent} ${styles.show}`
        : styles.dropdownContent;

    let hasAuthority = props.role === "Project Manager";
    return (
        <div className={styles.dropdown}>
            <button onClick={props.onManageClick} className={styles.dropbtn} title="Project menu">
                <i className="fas fa-bars" />
            </button>
            <div className={showClass}>
                {hasAuthority ? <p onClick={props.onAddMember}>Add Members</p> : null}
                {hasAuthority ? <p onClick={props.onRemoveMember}>Remove Members</p> : null}
                <p onClick={props.onLeaveProject}>Leave Project</p>
            </div>
        </div>
    );
};

export default ManagementButton;
