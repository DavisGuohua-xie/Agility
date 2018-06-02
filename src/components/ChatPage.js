import React, { Component } from "react";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";

import { withRouter, Redirect } from "react-router";

import Sidebar from "react-sidebar";
import Parse from "parse";
import Chatkit from "@pusher/chatkit";
import ReactLoading from "react-loading";
import toastr from './common/toastrConfig';

import { chatActions } from "../actions/chatActions";

import { NavBar } from "./common/Navbar";
import ChatLayout from "./chat/ChatLayout";

import MemberSidebarItem from "./common/MemberSidebarItem";

import styles from "../styles/ChatLayout.module.css";
import ChatSidebar from "./chat/ChatSidebar";

const mql = window.matchMedia(`(min-width: 900px)`);
let chatManager = undefined;

class ChatPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            sidebarOpen: false,
            mql: mql,
            sidebarDocked: props.docked,
            open: true,
            projectID: props.match.params.projID,
            chatkitUsername: props.username + props.match.params.projID,
            channels: [],
            msgList: [],
            chatkitUser: undefined,
            newMessageContent: "",
            isModalOpen: false,
            newChannelName: "",
            newChannelMembers: [],
            createGroupChannel: false,
            currentChannel: undefined,
            currentChannelId: undefined
        };

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleMessageSend = this.handleMessageSend.bind(this);
        this.handleNewChannelNameChange = this.handleNewChannelNameChange.bind(this);
        this.handleCreateChannel = this.handleCreateChannel.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.switchToChannel = this.switchToChannel.bind(this);
        this.handleMemberClick = this.handleMemberClick.bind(this);

        console.log(this.props.chatActions);
    }

    componentDidMount() {
        if(!this.props.logged_in) {
            this.props.history.replace("/login");
            return;
        }

        mql.addListener(this.mediaQueryChanged);
        this.setState({ mql: mql, sidebarDocked: mql.matches });
        
        // TODO: fetch project data from server
        // TODO: call redux action

        this.props.chatActions.instantiateChatkit(this.state.chatkitUsername);
        this.props.chatActions.login(
            this.state.chatkitUsername,
            this.props.firstName,
            this.props.lastName
        );
        this.props.chatActions.connectChatkit();

        this.setState({
            msgList: [],
            channels: [],
            currentChannel: undefined
        });
    }

    static getDerivedStateFromProps(props, state) {
        return {
            msgList: props.msgList,
            channels: props.channels,
            currentChannel: props.currentChannel,
            currentChannelId: props.currentChannelId
        };
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
        // remove all room subscriptions
        this.props.chatActions.logoff();
    }

    switchToChannel(e) {
        let channelId = parseInt(e.target.dataset.channelid);
        this.props.chatActions.switchToChannel(channelId, this.props.currentChannelId);
        this.setState({
            currentChannel: { id: channelId }
        }); // to make ui seem responsive
    }

    toggleModal(e) {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            createGroupChannel: e.target.dataset.name === "group",
            newChannelMembers: []
        });
    }

    handleCreateChannel(e) {
        e.preventDefault();
        // create channel
        let channelSwitchReqObj = { target: { dataset: { channelid: undefined } } };

        let members = this.state.createGroupChannel
            ? this.props.projectMembers
            : this.state.newChannelMembers;

        if (members.length == 0 || this.state.newChannelName.length == 0) {
            toastr.error("Specify channel name and/or members", "Can't create channel");
            return;
        }

        this.props.chatActions.createChannel(
            members,
            this.state.newChannelName,
            this.state.chatkitUsername,
            this.state.createGroupChannel,
            this.props.currentChannelId,
            this.state.projectID
        );

        this.resetNewChannelFields();
        this.toggleModal(channelSwitchReqObj);
    }

    resetNewChannelFields() {
        this.setState({
            newChannelMembers: [],
            newChannelName: ""
        });
    }

    handleNewChannelNameChange(e) {
        this.setState({
            newChannelName: e.target.value
        });
    }

    handleMessageChange(e) {
        this.setState({
            newMessageContent: e.target.value
        });
    }

    handleMessageSend(e) {
        e.preventDefault();

        if (this.state.newMessageContent.length === 0) return;

        console.log("handlemessagesend");
        console.log(this.props.currentChannelId);
        this.props.chatActions.sendMessage(
            this.state.newMessageContent,
            this.state.currentChannelId
        );

        this.setState({
            newMessageContent: ""
        });
    }

    handleMemberClick(e) {
        let name = e.target.dataset.name;
        console.log(name);
        let newChannelMembers = this.state.newChannelMembers;

        if (newChannelMembers.indexOf(name) < 0) newChannelMembers.push(name);
        else newChannelMembers.splice(newChannelMembers.indexOf(name), 1);

        this.setState({ newChannelMembers: newChannelMembers });
    }

    mediaQueryChanged() {
        this.setState({ sidebarDocked: this.state.mql.matches });
    }

    toggleSidebar(open) {
        this.setState({ sidebarOpen: open ? true : false });
    }

    render() {
        return (
            <div style={{ height: "100%" }}>
                <NavBar
                    history={this.props.history}
                    projName="Project name"
                    projID={this.state.projectID}
                    zIndex={2}
                />
                <Sidebar
                    sidebar={
                        <ChatSidebar
                            channels={this.state.channels}
                            onToggle={this.toggleModal}
                            onChannelClick={this.switchToChannel}
                            activeChannel={this.state.currentChannelId}
                        />
                    }
                    open={this.state.sidebarOpen}
                    docked={this.state.sidebarDocked}
                    onSetOpen={this.toggleSidebar}
                    styles={{
                        root: { top: "56px", overflowY: "auto" },
                        content: { overflowY: "auto" },
                        overlay: { top: "56px" },
                        sidebar: { backgroundColor: "white", width: 200, zIndex: 3 }
                    }}
                >
                    {this.props.metadata_loading ? (
                        <ReactLoading type="bars" color="#357EDD" />
                    ) : (
                        <ChatLayout
                            messageList={this.state.msgList}
                            docked={this.state.sidebarDocked}
                            toggleSidebar={this.toggleSidebar}
                            onMessageChange={this.handleMessageChange}
                            onSubmit={this.handleMessageSend}
                            messageContent={this.state.newMessageContent}
                            isModalOpen={this.state.isModalOpen}
                            onToggleModal={this.toggleModal}
                            onInputChange={this.handleNewChannelNameChange}
                            onCreateChannel={this.handleCreateChannel}
                            groupChannel={this.state.createGroupChannel}
                            currentRoom={this.state.currentChannel}
                            loading={this.props.chat_loading}
                            members={this.props.projectMembers.filter(
                                id => id !== this.props.username
                            )}
                            onMemberClick={this.handleMemberClick}
                            selectedMembers={this.state.newChannelMembers}
                        />
                    )}
                </Sidebar>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        chatActions: bindActionCreators(chatActions, dispatch)
    };
}

function mapStateToProps(state, ownProps) {
    console.log(state);
    // TODO: need to get list of channel objects from store state
    return {
        ajaxCalls: state.ajaxCallsInProgress,
        logged_in: state.authReducer.logged_in,
        username: state.authReducer.username,
        firstName: state.authReducer.first_name,
        lastName: state.authReducer.last_name,
        msgList: state.chatReducer.msgList,
        channels: state.chatReducer.channelList,
        currentChannel: state.chatReducer.currentChannelName,
        currentChannelId: state.chatReducer.currentChannelId,
        chat_loading: state.chatReducer.chat_loading,
        metadata_loading: state.chatReducer.metadata_loading,
        projectMembers: ["testFL", "newtestakshara", "newtestakshara1"] // TODO: get actual project members
        //channelIds: state.projReducer.currProject.channels,
        //projectMembers: state.projReducer.currProject.roles
    };
}

const connectedChatPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatPage));
export { connectedChatPage as ChatPage };
