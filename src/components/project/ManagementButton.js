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
                <p>Add/Remove Members</p>
                <p>Export Tasks</p>
            </div>
        </div>
    );
};

export default ManagementButton;
