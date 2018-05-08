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
        return (
            <div style={{height: '100%'}}>
                <NavBar projName='Project name'/>
                <ChatLayout/>
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