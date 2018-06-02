import React from "react";
import PropTypes from "prop-types";

import { Container, Button } from "reactstrap";

import ProjectItem from "../misc/ProjectItem";
import {ProjectModel} from "../../models/ProjectModel"

import styles from "../../styles/ProjectList.module.css";

const ProjectList = props => {


    return (
        <Container>
            <h1 className={styles.projectHeader}>Your Projects</h1>
            <div className={styles.btnDiv}>
                <Button
                    color="primary"
                    size="lg"
                    className={styles.newProjBtn}
                    onClick={props.onNewProject}
                >
                    New Project
                </Button>
            </div>
            <div className={styles.listContainer}>
                {
                  // console.log(props.projects);
                  (props.projects != undefined || props.projects != null ? props.projects: []) .map((item, index) => (
                    <ProjectItem
                        key={item.id}
                        name={item.getName()}
                        id={item.id}
                        onClick={props.onClick}
                    />
                ))}
            </div>
        </Container>
    );
};

export default ProjectList;

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
};
