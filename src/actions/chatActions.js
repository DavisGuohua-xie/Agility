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

function retrieveChannels(currentUser) {
    return dispatch => {

    }
}

function retrieveMessages(chatmanager, channelId) {
    return dispatch => {

    }
}

function retrieveChannelsRequest(currentUser) {
    return { type: types.RETRIEVE_CHANNELS_REQUEST, req: currentUser };
}

function retrieveChannelsSuccess(currentUser) {
    return { type: types.RETRIEVE_CHANNELS_SUCCESS, req: currentUser };
}

function retrieveChannelsFailure(currentUser) {
    return { type: types.RETRIEVE_CHANNELS_FAILURE, req: currentUser };
}