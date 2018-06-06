import React from "react";

import styles from "../../styles/StickyNote.module.css";

export const StickyNote = props => {
    let color;
    switch (props.metadata.priority) {
        case 0:
            color = styles.lightGreen;
            break;
        case 1:
            color = styles.lightBlue;
            break;
        case 2:
            color = styles.lightYellow;
            break;
        case 3:
            color = styles.lightCoral;
            break;
        default:
            break;
    }

    console.log(color);
    return (
        <div className={`${styles.container} ${color}`}>
            <header
                style={{
                    borderBottom: "1px solid #eee",
                    paddingBottom: 10,
                    marginBottom: 10,
                    paddingLeft: 10,
                    paddingTop: 10
                }}
            >
                <div
                    style={{
                        fontSize: "1.5em",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        paddingRight: 5,
                        marginTop: 20,
                        clear: "both"
                    }}
                >
                    {props.title}
                </div>
                <div style={{ fontSize: "1em", position: "absolute", right: 10, top: 10 }}>
                    {new Date(props.metadata.due_date).toLocaleDateString()}
                </div>
            </header>
            <div style={{ fontSize: 20, color: "#BD3B36" }}>
                <div style={{ padding: "10px 10px",whiteSpace: "pre-wrap",
                        wordWrap: "break-word" }}>
                    <i>{props.description}</i>
                </div>
            </div>
        </div>
    );
};
