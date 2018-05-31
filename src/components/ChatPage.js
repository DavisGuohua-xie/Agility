import React, { Component } from "react";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";

import { withRouter } from "react-router";

import Sidebar from "react-sidebar";
import Parse from "parse";
import Chatkit from "@pusher/chatkit";

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
            currentRoom: undefined
        };

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.loginToChat = this.loginToChat.bind(this);
        this.connectChatkit = this.connectChatkit.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleMessageSend = this.handleMessageSend.bind(this);
        this.handleNewChannelNameChange = this.handleNewChannelNameChange.bind(this);
        this.handleCreateChannel = this.handleCreateChannel.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.switchToChannel = this.switchToChannel.bind(this);

        console.log(this.props.chatActions);
    }

    componentDidMount() {
        mql.addListener(this.mediaQueryChanged);
        this.setState({ mql: mql, sidebarDocked: mql.matches });
        // TODO: fetch project data from server
        // TODO: call redux action

        var currentUser = Parse.User.current();
        if (!currentUser) {
            this.props.history.push("/login");
        }

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
            currentChannel: props.currentChannel
        };
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
        // remove all room subscriptions
    }

    /*******************************CHATKIT SPECIFIC FUNCTIONS *******************/
    loginToChat() {
        fetch("http://localhost:3001/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.chatkitUsername,
                firstName: this.props.firstName,
                lastName: this.props.lastName
            })
        })
            .then(response => {
                if (response.status === 200)
                    console.log(
                        `user already on chatkit server with username: ${this.props.username}`
                    );
                else if (response.status === 201)
                    console.log(
                        `user created on chatkit server with username: ${this.props.username}`
                    );
            })
            .catch(error => console.error("error", error));
    }

    connectChatkit() {
        let currUser;

        chatManager
            .connect()
            .then(currentUser => {
                console.log("current user: ", currentUser);
                currUser = currentUser;

                this.setState({
                    chatkitUser: currentUser,
                    currChannel: currentUser.rooms ? currentUser.rooms[0] : undefined
                });

                let currChannel = currentUser.rooms ? currentUser.rooms[0] : undefined;

                return currentUser.joinRoom({ roomId: 8453381 });
            })
            .then(room => {
                console.log(`joined room with room id: ${room.id}`);
                console.log("\n\n\n\nROOMS\n\n\n\n");
                console.log(currUser.rooms);
                this.setState({
                    channels: currUser.rooms,
                    currChannel: room.id
                });
                return currUser.subscribeToRoom({
                    roomId: room.id,
                    messageLimit: 100,
                    hooks: {
                        onNewMessage: message => {
                            this.setState({
                                msgList: [...this.state.msgList, message]
                            });
                        }
                    }
                });
            })
            .then(currentRoom => {
                console.log(`subscribed to room with room id: ${currentRoom.id}`);
                this.setState({ currentRoom });
            })
            .catch(error => console.log(error));
    }

    sendMessage(text) {
        this.state.chatkitUser.sendMessage({
            text: text,
            roomId: this.state.currChannel
        });
    }

    switchToChannel(e) {
        let channelId = parseInt(e.target.dataset.channelid);
        console.log(this.state.chatkitUser.roomSubscriptions);
        // close current subscription (ACTION)
        if (this.state.currChannel) {
            this.state.chatkitUser.roomSubscriptions[this.state.currChannel].cancel();
        }
        this.setState({ msgList: [] });

        //open new subscription to new channel
        this.state.chatkitUser
            .subscribeToRoom({
                roomId: channelId,
                messageLimit: 100,
                hooks: {
                    onNewMessage: message => {
                        this.setState({
                            msgList: [...this.state.msgList, message]
                        });
                    }
                }
            })
            .then(currentRoom => {
                console.log(`subscribed to room with room id: ${currentRoom.id}`);
                this.setState({ currentRoom: currentRoom, currChannel: currentRoom.id });
            })
            .catch(error => console.log(error));
    }

    createChannel(members, name, creatorId, isPrivate) {
        return fetch("http://localhost:3001/createchannel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                creator: creatorId,
                teamMembers: members,
                channelName: name,
                isPrivate: isPrivate
            })
        });
    }

    /*******************************END CHATKIT SPECIFIC FUNCTIONS *******************/

    toggleModal(e) {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            createGroupChannel: e.target.dataset.name === "group"
        });
    }

    handleCreateChannel(e) {
        e.preventDefault();
        // create channel
        let channelSwitchReqObj = { target: { dataset: { channelid: undefined } } };

        let members = this.state.createGroupChannel
            ? this.props.projectMembers
            : this.state.newChannelMembers;

        this.createChannel(
            members,
            this.state.newChannelName,
            this.state.chatkitUser.id,
            !this.state.createGroupChannel
        )
            .then(response => {
                return response.json();
            })
            .then(roomObj => {
                console.log(roomObj);
                console.log(`channel created on server with name: ${roomObj.name}`);

                console.log(this.state.chatkitUser);
                this.setState({ channels: this.state.chatkitUser.rooms });

                channelSwitchReqObj.target.dataset.channelid = roomObj.id;

                this.switchToChannel(channelSwitchReqObj);
            })
            .catch(error => console.error("error", error));

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

        this.sendMessage(this.state.newMessageContent);

        this.setState({
            newMessageContent: ""
        });
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
                            activeChannel={this.props.currentChannel}
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
                    />
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
        username: state.authReducer.username,
        firstName: state.authReducer.first_name,
        lastName: state.authReducer.last_name,
        msgList: state.chatReducer.msgList,
        channels: state.chatReducer.channelList,
        currentChannel: state.chatReducer.currentChannel,
        projectMembers: ["undefinedid1"] // TODO: get actual project members
        //channelIds: state.projReducer.currProject.channels,
        //projectMembers: state.projReducer.currProject.roles
    };
}

const connectedChatPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatPage));
export { connectedChatPage as ChatPage };
