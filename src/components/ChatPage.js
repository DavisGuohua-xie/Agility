import React, { Component } from "react";

import { connect } from "react-redux";

import { bindActionCreators } from "redux";

import { withRouter } from "react-router";

import Sidebar from "react-sidebar";
import Parse from "parse";
import Chatkit from "@pusher/chatkit";

import * as chatActions from "../actions/chatActions";

import { NavBar } from "./common/Navbar";
import ChatLayout from "./chat/ChatLayout";

import MemberSidebarItem from "./common/MemberSidebarItem";

import styles from "../styles/ChatLayout.module.css";
import ChatSidebar from "./chat/ChatSidebar";

/* TODO: delete mock proj member data */
const members = [
    { fname: "Joe", lname: "Schmo" },
    { fname: "Joe", lname: "Schmo" },
    { fname: "Joe", lname: "Schasdfasdfamo" },
    { fname: "Joe", lname: "Schmo" },
    { fname: "Joe", lname: "Schasdfasdfamo" },
    { fname: "Joe", lname: "Schmo" },
    { fname: "Joe", lname: "Schasdfasdfamo" },
    { fname: "Joe", lname: "Schmo" },
    { fname: "Joe", lname: "Schasdfasdfamo" },
    { fname: "Joe", lname: "Schmo" },
    { fname: "Joe", lname: "Schasdfasdfamo" },
    { fname: "Joe", lname: "Schmo" },
    { fname: "Joe", lname: "Schasdfasdfamo" },
    { fname: "Joe", lname: "Schmo" }
];

const mql = window.matchMedia(`(min-width: 900px)`);
let chatManager = undefined;

class ChatPage extends Component {
    constructor(props) {
        super(props);
        /* TODO: remove comment when redux store set up: props.history.push(`/chat/${props.channels[0].id}`);
        this.state = {
            channelList: props.channels,
            currChannel: props.channels[0],
            msgList: props.channels[0].history,
            currUser: props.currUser
        };*/
        this.state = {
            active: 0,
            sidebarOpen: false,
            mql: mql,
            sidebarDocked: props.docked,
            open: true,
            members: members,
            projectID: props.match.params.projID,
            chatkitUsername: props.username + props.match.params.projID,
            channels: [],
            msgList: [],
            chatkitUser: undefined,
            newMessageContent: "",
            isModalOpen: false,
            newChannelName: ""
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

        chatManager = new Chatkit.ChatManager({
            instanceLocator: "v1:us1:dae44b3a-7d46-4d6b-8894-1302096c409d",
            userId: this.state.chatkitUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url: "http://localhost:3001/authenticate"
            })
        }); // instantiate chatmanager instance on this client

        this.loginToChat(); // login to chatkit with this user
        this.connectChatkit(); // connect to chatkit instance
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
        // remove all room subscriptions
    }

    loginToChat() {
        fetch("http://localhost:3001/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: this.state.chatkitUsername })
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
                    chatkitUser: Object.assign({}, currentUser),
                    currChannel: currentUser.rooms ? currentUser.rooms[0] : undefined
                });

                let currChannel = currentUser.rooms ? currentUser.rooms[0] : undefined;

                return currentUser.joinRoom({ roomId: 8414397 });
            })
            .then(room => {
                console.log(`joined room with room id: ${room.id}`);
                console.log("\n\n\n\nROOMS\n\n\n\n");
                console.log(currUser.rooms);
                this.setState({
                    channels: currUser.rooms
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
            roomId: this.state.currChannel.id
        })
    }

    /******************************************/

    toggleModal(e) {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            createGroupChannel: e.target.name === "group"
        });
    }

    handleCreateChannel(e) {
        // create channel
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

        if(this.state.newMessageContent.length === 0) return;

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
                />
                <Sidebar
                    sidebar={<ChatSidebar channels={this.state.channels} onToggle={this.toggleModal}/>}
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
                    />
                </Sidebar>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(chatActions, dispatch)
    };
}

function mapStateToProps(state, ownProps) {
    console.log(state);
    // TODO: need to get list of channel objects from store state
    return {
        ajaxCalls: state.ajaxCallsInProgress,
        username: state.authReducer.username
        //channelIds: state.projReducer.currProject.channels,
        //projectMembers: state.projReducer.currProject.roles
    };
}

const connectedChatPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatPage));
export { connectedChatPage as ChatPage };
