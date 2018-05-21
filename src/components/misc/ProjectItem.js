import React from 'react';

import styles from '../../styles/ProjectItem.module.css';

const ProjectItem = props => {
    return (
        <button className={styles.projectItem} onClick={props.onClick} id={props.id}>
            {props.name}
        </button>
    );
};

export default ProjectItem;