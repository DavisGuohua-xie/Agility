import React from "react";
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";

import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

const TaskDetail = props => {

    console.log(props.cardObject);
    let cardTitle = props.cardObject.title;
    let cardDescription = props.cardObject.description;
    let cardDeadline;

    try {
        cardDeadline = moment(props.cardObject.metadata.due_date);
        if (!props.cardObject.metadata.due_date) throw "error";
    } catch (err) {
        cardDeadline = moment();
    }

    //let cardAssignedTo = props.cardObject.assigned_to;
    let cardPriority = props.cardObject.metadata.priority;

    return (
        <Modal isOpen={props.modalOpen} toggle={props.onToggleModal}>
            <ModalHeader toggle={props.onToggleModal}>Edit Task Details</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="taskName">Task Name</Label>
                        <Input
                            type="text"
                            name="title"
                            id="taskName"
                            placeholder="Enter task name"
                            onChange={props.onTextInputChange}
                            value={cardTitle}
                        />
                        <Label for="taskDescription">Task Description</Label>
                        <Input
                            type="text"
                            name="description"
                            id="taskDescription"
                            placeholder="Enter task description"
                            onChange={props.onTextInputChange}
                            value={cardDescription}
                        />
                        <Label for="deadline">Deadline</Label>
                        <DatePicker
                            name="due_date"
                            id="deadline"
                            value={`${moment(cardDeadline).format("MM/DD/YYYY")}`}
                            selected={moment(cardDeadline)}
                            onChange={props.onTaskDeadlineChange}
                        />
                        <Label for="taskPriority">Priority</Label>
                        <Input
                            type="select"
                            name="priority"
                            id="taskPriority"
                            value={cardPriority}
                            onChange={props.onPriorityChange}
                        >
                            <option value="0">Low</option>
                            <option value="1">Medium</option>
                            <option value="2">High</option>
                            <option value="3">Critical</option>
                        </Input>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={props.onToggleModal}>
                    Cancel
                </Button>
                <Button color="primary" onClick={props.saveTask}>
                    Save Task
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default TaskDetail;
