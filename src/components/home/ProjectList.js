import React from 'react';
import PropTypes from 'prop-types';

import {
    Container,
    Row,
    Col
} from 'reactstrap';

import ProjectItem from '../misc/ProjectItem';

import styles from '../../styles/ProjectList.module.css';

const ProjectList = (props) => {
    return (
        <Container>
            <div className={styles.listContainer}>
                {props.projects.map((item, index) => <ProjectItem key={index} name={item.name}/>)}
                <ProjectItem name="Create new project..." />
            </div>
        </Container>
    );
};

export default ProjectList;

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
}