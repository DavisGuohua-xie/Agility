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
            showCardModal: true,
            cardObject: cardObj
        });
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

        boards.filter(board => board.id === boardID)[0].title = this.state.newBoard;

        this.setState({ tasksData: { lanes: boards } });
        this.state.eventBus.publish({ type: "UPDATE_LANES", lanes: boards });
        this.toggleEditModal(e);
        this.props.updateTasks({ lanes: boards });
    }

    handleBoardNameChange(e) {
        this.setState({ newBoard: e.target.value });
    }

    handleCardAdd(card, laneId) {
        this.props.actions.createTask(card.title, laneId, this.props.username);
    }

    toggleEditModal(e) {
        let boardName = e.target.dataset.title;
        let boardID = e.target.dataset.id;

        if (this.state.editing) boardName = "";
        this.setState({ newBoard: boardName, editing: !this.state.editing, boardID: boardID });
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
                onToggleCardModal={this.handleCardClick}
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
