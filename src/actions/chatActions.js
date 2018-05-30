import * as types from './actionTypes';
import * as ajaxActions from './ajaxActions';

const MAX_MESSAGES_RETRIEVE = 100;

function saveMessage(message, thread) {
    return dispatch => {
        
    };
}

function createChannel(isGroup, channelName, participants) {
    return dispatch => {
        /*
            1. add channel object to server
            2. create channel on chatkit server
            3. update redux store state
        */
    };
}

function retrieveMessages(chatmanager, channelId) {
    return dispatch => {

    }
}