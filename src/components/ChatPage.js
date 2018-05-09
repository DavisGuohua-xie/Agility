import React, {
    Component
} from 'react';

import {
    connect
} from 'react-redux';

import {
    bindActionCreators
} from 'redux';

import {
    withRouter
} from 'react-router';

import * as chatActions from '../actions/chatActions';

import NavBar from './common/Navbar';
import ChatLayout from './chat/ChatLayout';

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
            channelList: [{name: "Group channel 1", is_channel: true, id: 'asdfa'}, {name: "Team member", is_channel: false, id: "asdfasdf"}],
            currChannel: 'Group channel 1',
            msgList: [{
                message: "Test message",
                sent_at: new Date(),
                sent_by: 'sdafasd232', // user id
                sent_by_name: 'Gary the Great' // TODO: need to add to db
            }],
            currUser: {id: 'random'},
            sidebarOpen: true
        };

        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    toggleSidebar() {
        this.setState({sidebarOpen: !this.state.sidebarOpen});
    }


    render() {
        let groupChannels = this.state.channelList.filter(channel => channel.is_channel);
        let dmChannels = this.state.channelList.filter(channel => !channel.is_channel);
        console.log(groupChannels);
        return (
            <div style={{height: '100%'}}>
                <NavBar projName='Project name'/>
                <ChatLayout
                    groups={groupChannels}
                    dms={dmChannels} 
                    currChannel={this.state.currChannel}
                    messageList={this.state.msgList} 
                    me={this.state.currUser.id}
                    sidebarOpen={this.state.sidebarOpen}
                    toggleSidebar={this.toggleSidebar}/>
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
        ajaxCalls: state.ajaxCallsInProgress
    }
}

const connectedChatPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatPage));
export {
    connectedChatPage as ChatPage
};