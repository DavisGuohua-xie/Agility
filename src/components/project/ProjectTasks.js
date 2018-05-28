import React from "react";

import { Container } from "reactstrap";

import Board from "react-trello";

let CustomLaneHeader = props => {
    return <p>{props.title}</p>;
};

export const ProjectTasks = props => {
    return (
        <Container fluid style={{ height: "calc(100% - 40px)", padding: 0 }}>
            <Board
                data={props.data}
                eventBusHandle={props.eventBus}
                draggable
                collapsibleLanes
                editable
                onLaneClick={props.onLaneClick}
                onCardClick={props.onCardClick}
                customLaneHeader={<CustomLaneHeader />}
                style={{
                    padding: "30px 0 0 0",
                    backgroundColor: "#fff",
                    fontFamily: "unset",
                    height: "100%",
                    paddingLeft: 15
                }}
            />
        </Container>
    );
};
