import React from 'react';

import styles from '../../styles/ProjectItem.module.css';

const ProjectItem = props => {
    return (
        <div className={styles.projectItem}>
            <p className={styles.projectName}>{props.name}</p>
        </div>
    );
};

export default ProjectItem;