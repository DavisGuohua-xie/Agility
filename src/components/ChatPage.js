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
            channelList: [
                { name: "Group channel 1", is_channel: true, id: "asdfa" },
                { name: "Team member", is_channel: false, id: "asdfasdf" }
            ],
            currChannel: "Group channel 1",
            msgList: [
                {
                    message: "Test message",
                    sent_at: new Date(),
                    sent_by: "sdafasd232", // user id
                    sent_by_name: "Gary the Great" // TODO: need to add to db
                },
                {
                    message: "Test message 2",
                    sent_at: new Date(),
                    sent_by: "sdafasd232", // user id
                    sent_by_name: "Joe" // TODO: need to add to db
                },
                {
                    message: "Test message 3",
                    sent_at: new Date(),
                    sent_by: "sdafasd232", // user id
                    sent_by_name: "Gary the Great" // TODO: need to add to db
                }
            ],
            currUser: { id: "random" },
            active: 0,
            sidebarOpen: false,
            mql: mql,
            sidebarDocked: props.docked,
            open: true,
            members: members,
            projectID: props.match.params.projID
        };

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.generateSidebar = this.generateSidebar.bind(this);
        this.loginToChat = this.loginToChat.bind(this);
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
            userId: this.props.username,
            tokenProvider: new Chatkit.TokenProvider({
                url: "http://localhost:3001/authenticate"
            })
        });

        this.loginToChat();
        this.connectChatkit();
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
    }

    loginToChat() {
        fetch("http://localhost:3001/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: this.props.username })
        })
            .then(response => {
                this.setState({
                    currentUsername: this.props.username
                });
                
                if(response.status === 200)
                    console.log(`user already on chatkit server with username: ${this.props.username}`);
                else if(response.status === 201)
                    console.log(`user created on chatkit server with username: ${this.props.username}`);
            })
            .catch(error => console.error("error", error));
    }

    connectChatkit() {
        chatManager.connect().then( currentUser => {
            console.log("current user: ", currentUser);
        }).catch(error => console.log(error));
    }

    mediaQueryChanged() {
        this.setState({ sidebarDocked: this.state.mql.matches });
    }

    toggleSidebar(open) {
        this.setState({ sidebarOpen: open ? true : false });
    }

    generateSidebar(groupChannels, dmChannels) {
        return (
            <div id="sidebar">
                <div className={styles.groupChannels}>
                    <p className={styles.channelHeader}>
                        Group Channels <i className={`fas fa-plus-circle ${styles.plus}`} />
                    </p>
                    <ul className={styles.channelList}>
                        {groupChannels.map(group => (
                            <li key={group.id} className={styles.channelItem}>
                                {group.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.directChannels}>
                    <p className={styles.channelHeader}>
                        Direct Messages <i className={`fas fa-plus-circle ${styles.plus}`} />
                    </p>
                    <ul className={styles.channelList}>
                        {dmChannels.map(group => (
                            <li key={group.id} className={styles.channelItem}>
                                {group.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    render() {
        let groupChannels = this.state.channelList.filter(channel => channel.is_channel);
        let dmChannels = this.state.channelList.filter(channel => !channel.is_channel);

        let sidebarContent = this.generateSidebar(groupChannels, dmChannels);
        console.log(groupChannels);
        return (
            <div style={{ height: "100%" }}>
                <NavBar
                    history={this.props.history}
                    projName="Project name"
                    projID={this.state.projectID}
                />
                <Sidebar
                    sidebar={sidebarContent}
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
                        groups={groupChannels}
                        dms={dmChannels}
                        currChannel={this.state.currChannel}
                        messageList={this.state.msgList}
                        me={this.state.currUser.id}
                        docked={this.state.sidebarDocked}
                        toggleSidebar={this.toggleSidebar}
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
    };
}

const connectedChatPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatPage));
export { connectedChatPage as ChatPage };
