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
            editing: false
        };

        this.handleLaneClick = this.handleLaneClick.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
        this.setEventBus = this.setEventBus.bind(this);
        this.handleCreateBoard = this.handleCreateBoard.bind(this);
        this.handleBoardNameChange = this.handleBoardNameChange.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.handleSaveBoard = this.handleSaveBoard.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return nextProps.modalOpen !== prevState.modalOpen
            ? { modalOpen: nextProps.modalOpen }
            : null;
    }

    handleLaneClick(e) {
        console.log(e);
    }

    handleCardClick(e) {
        console.log(e);
    }

    setEventBus = handle => {
        this.setState({ eventBus: handle });
    };

    handleCreateBoard() {
        if (this.state.newBoard === "") return;

        this.props.actions.createBoard(this.state.newBoard, this.props.project_id);
        
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

        this.state.eventBus.publish({ type: "UPDATE_LANES", lanes: boards.lanes });
        */
        this.props.onToggleModal();
        this.props.updateTasks(boards);
    }

    handleSaveBoard(e) {
        if(this.state.newBoard === "") return;

        let boards = this.state.tasksData;

        let boardInd = parseInt(this.state.boardInd, 10);


        boards.lanes[boardInd].title = this.state.newBoard;

        this.setState({tasksData: boards});
        this.state.eventBus.publish({ type: "UPDATE_LANES", lanes: boards.lanes });
        this.toggleEditModal(e);
        this.props.updateTasks(boards);
    }

    handleBoardNameChange(e) {
        this.setState({ newBoard: e.target.value });
    }

    toggleEditModal(e) {
        let boardName = e.target.dataset.title;
        let boardInd = e.target.dataset.id;

        if (this.state.editing) boardName = "";
        this.setState({ newBoard: boardName, editing: !this.state.editing, boardInd: boardInd });
        this.props.onToggleModal();
    }

    render() {
        return (
            <ProjectTasks
                data={this.state.tasksData}
                eventBusHandle={this.setEventBus}
                onLaneClick={this.handleLaneClick}
                onCardClick={this.handleCardClick}
                modalOpen={this.state.modalOpen}
                onBoardNameChange={this.handleBoardNameChange}
                onCreateBoard={this.handleCreateBoard}
                onToggleModal={this.props.onToggleModal}
                boardName={this.state.newBoard}
                onToggleEditModal={this.toggleEditModal}
                onSaveBoard={this.handleSaveBoard}
                editing={this.state.editing}
            />
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(taskActions, dispatch)
    };
}

function mapStateToProps(state, ownProps) {
    return {
        ajaxCalls: state.ajaxCallsInProgress,
    };
}

const connectedPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectTaskComponent));
export { connectedPage as ProjectTaskComponent };
