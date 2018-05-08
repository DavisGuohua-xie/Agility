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
    }


    render() {
        let msgList = [{
            message: "Test message",
            sent_at: new Date(),
            sent_by: 'sdafasd232', // id
            sent_by_name: 'Gary the Great'
        }];
        return (
            <div style={{height: '100%'}}>
                <NavBar projName='Project name'/>
                <ChatLayout messageList={msgList} me={{id: 'random'}}/>
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
    return {
        ajaxCalls: state.ajaxCallsInProgress
    }
}

const connectedChatPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatPage));
export {
    connectedChatPage as ChatPage
};