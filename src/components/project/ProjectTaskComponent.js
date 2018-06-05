import React from "react";

import { ProjectTasks } from "./ProjectTasks";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { taskActions } from "../../actions/taskActions";
import v4 from "uuid";

class ProjectTaskComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            tasksData: props.taskList,
            newBoard: "",
            eventBus: undefined,
            editing: false,
            showCardModal: false,
            is_done: false,
            cardObject: {}
        };

        this.handleLaneClick = this.handleLaneClick.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
        this.setEventBus = this.setEventBus.bind(this);
        this.handleCreateBoard = this.handleCreateBoard.bind(this);
        this.handleCardAdd = this.handleCardAdd.bind(this);
        this.handleBoardNameChange = this.handleBoardNameChange.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.handleSaveBoard = this.handleSaveBoard.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
        this.handleBoardTypeChange = this.handleBoardTypeChange.bind(this);
        this.toggleEditCardModal = this.toggleEditCardModal.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.modalOpen !== prevState.modalOpen ||
            nextProps.taskList !== prevState.tasksData
        ) {
            console.log("updating lanes in projecttaskcomponent");
            if (prevState.eventBus && nextProps.taskList !== prevState.tasksData)
                prevState.eventBus.publish({
                    type: "UPDATE_LANES",
                    lanes: nextProps.taskList.lanes
                });
            return { modalOpen: nextProps.modalOpen, tasksData: nextProps.taskList };
        }
        return null;
    }

    handleLaneClick(e) {
        console.log(e);
    }

    handleCardClick(cardId, metadata, laneId) {
        console.log(cardId);

        let cardObj = this.state.tasksData.lanes
            .filter(board => board.id === laneId)[0]
            .cards.filter(card => card.id === cardId)[0]; // get proper card object

        console.log(cardObj);

        this.setState({
            cardObject: cardObj
        });

        this.toggleEditCardModal();
    }

    toggleEditCardModal() {
        this.setState({ showCardModal: !this.state.showCardModal });
    }

    setEventBus = handle => {
        this.setState({ eventBus: handle });
    };

    handleCreateBoard() {
        if (this.state.newBoard === "") return;

        this.props.actions.createBoard(
            this.state.newBoard,
            this.props.project_id,
            this.state.eventBus
        );

        /*
        let boards = Object.assign({}, this.state.tasksData);
        boards.lanes.push({
            id: (boards.lanes.length) + "",
            title: this.state.newBoard,
            label: "",
            cards: []
        });

        this.setState({ tasksData: boards });
        console.log(this.state.eventBus);

        
        */
        this.props.onToggleModal();
        //this.props.updateTasks(boards);
    }

    handleSaveBoard(e) {
        e.preventDefault();
        if (this.state.newBoard === "") return;

        let boards = this.state.tasksData.lanes;
        let boardID = this.state.boardID;

        let newBoard = { title: this.state.newBoard, is_done: this.state.is_done };

        this.toggleEditModal(e);
        this.props.updateBoard(boardID, newBoard);
    }

    handleBoardNameChange(e) {
        this.setState({ newBoard: e.target.value });
    }

    handleBoardTypeChange(e) {
        this.setState({ is_done: e.target.checked });
    }

    handleCardAdd(card, laneId) {
        this.props.actions.createTask(card, laneId, this.props.username);
    }

    toggleEditModal(e) {
        if (this.props.modalOpen) {
            this.setState({ editing: !this.state.editing, newBoard: "" });
            this.props.onToggleModal();
            return;
        }

        let boardName = e.target.dataset.title;
        let boardID = e.target.dataset.id;

        if (this.state.editing) boardName = "";
        this.setState({
            newBoard: boardName,
            editing: !this.state.editing,
            boardID: boardID,
            is_done: this.props.boards.filter(b => b.id === boardID)[0].is_done ? true : false
        });

        this.props.onToggleModal();
    }

    render() {
        return (
            <ProjectTasks
                data={this.state.tasksData}
                eventBusHandle={this.setEventBus}
                onLaneClick={this.handleLaneClick}
                onCardAdd={this.handleCardAdd}
                onCardClick={this.handleCardClick}
                modalOpen={this.state.modalOpen}
                onBoardNameChange={this.handleBoardNameChange}
                onCreateBoard={this.handleCreateBoard}
                onToggleModal={this.props.onToggleModal}
                boardName={this.state.newBoard}
                onToggleEditModal={this.toggleEditModal}
                onSaveBoard={this.handleSaveBoard}
                editing={this.state.editing}
                showCardModal={this.state.showCardModal}
                onToggleCardModal={this.toggleEditCardModal}
                onBoardTypeChange={this.handleBoardTypeChange}
                editBoardType={this.state.is_done}
                cardObject={this.state.cardObject}
            />
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(taskActions, dispatch)
    };
}

const connectedPage = withRouter(connect(null, mapDispatchToProps)(ProjectTaskComponent));
export { connectedPage as ProjectTaskComponent };
