import React from 'react';
import PropTypes from 'prop-types';

import {
    Container, Button
} from 'reactstrap';

import ProjectItem from '../misc/ProjectItem';

import styles from '../../styles/ProjectList.module.css';

const ProjectList = (props) => {
    return (
        <Container>
            <h1 className={styles.projectHeader}>Your projects</h1>
            <div className={styles.btnDiv}>
                <Button color="primary" size="lg" className={styles.newProjBtn} onClick={props.onNewProject}>New Project</Button>
            </div>
            <div className={styles.listContainer}>
                {props.projects.map((item, index) => <ProjectItem key={index} name={item.name}/>)}
            </div>
        </Container>
    );
};

export default ProjectList;

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
}