import React from "react";
import { Row, Col, Input } from "reactstrap";

import styles from "../../styles/NewProjectMember.module.css";

const NewProjectMember = props => {
    return (
        <Row style={{ marginTop: 10 }}>
            <Col md="5" sm="5" xs="5">
                <Input
                    type="text"
                    name={`member${props.realKey}`}
                    id={`member${props.realKey}`}
                    placeholder="Username"
                    onChange={props.onNameChange}
                />
            </Col>
            <Col md="5" sm="6" xs="6">
                <Input
                    type="select"
                    name={`role${props.realKey}`}
                    id={`role${props.realKey}`}
                    defaultValue="0"
                    onChange={props.onRoleChange}
                >
                    <option value="0">Project Member</option>
                    <option value="1">Project Manager</option>
                </Input>
            </Col>
            <Col md={{ offset: 1, size: 1 }} sm="1" xs="1">
                <i
                    onClick={props.onDelete}
                    id={props.realKey}
                    className={`${styles.deleteIcon} fas fa-times`}
                />
            </Col>
        </Row>
    );
};

export default NewProjectMember;
