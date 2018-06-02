import * as types from "./actionTypes";
import * as ajaxActions from "./ajaxActions";

import Chatkit from "@pusher/chatkit";
import "toastr/build/toastr.css";
import toastr from "toastr";
toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-right",
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "3000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};

export const chatActions = {
    instantiateChatkit,
    login,
    connectChatkit,
    reset,
    sendMessage,
    switchToChannel,
    createChannel
};

const MAX_MESSAGES_RETRIEVE = 100;

let chatManager = null;
let currUser = null;

function instantiateChatkit(chatkitUsername) {
    return dispatch => {
        chatManager = new Chatkit.ChatManager({
            instanceLocator: "v1:us1:dae44b3a-7d46-4d6b-8894-1302096c409d",
            userId: chatkitUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url: "http://localhost:3001/authenticate"
            })
        }); // instantiate chatmanager instance on this client
    };
}

function login(chatkitUsername, firstName, lastName) {
    return dispatch => {
        dispatch(loadingMessages());
        fetch("http://localhost:3001/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: chatkitUsername,
                firstName: firstName,
                lastName: lastName
            })
        })
            .then(response => {
                if (response.status === 200)
                    console.log(`user already on chatkit server with username: ${chatkitUsername}`);
                else if (response.status === 201)
                    console.log(`user created on chatkit server with username: ${chatkitUsername}`);
            })
            .catch(error => console.error("ERRORORROROROR", error));
    };
}

function connectChatkit() {
    return dispatch => {
        chatManager
            .connect()
            .then(currentUser => {
                console.log("current user: ", currentUser.rooms);
                currUser = currentUser;
                let currChannel = currentUser.rooms ? currentUser.rooms[0] : undefined;
                return currentUser.joinRoom({ roomId: currChannel.id });
            })
            .then(room => {
                console.log(`joined room with room id: ${room.id}`);
                console.log("\n\n\n\nROOMS\n\n\n\n");
                console.log(currUser.rooms);

                return subscribeToChannel(room.id, dispatch);
            })
            .then(currRoom => {
                console.log(`subscribed to room with room id: ${currRoom.id}`);
                dispatch(saveAllChatData(currUser.rooms, currRoom));
                dispatch(finishedLoadingMessages());
                return fetchMessages(currRoom);
            })
            .then(messages => {
                console.log(messages);
                dispatch(saveMessages(messages));
            })
            .catch(error => {
                console.log(error);
            });
    };
}

function reset(currentRoom, softClear) {
    return dispatch => {
        unsubscribeFromChannel(currentRoom);
        if (softClear) {
            dispatch(clearSoftChatState());
        } else {
            dispatch(clearChatState());
        }
    };
}

function switchToChannel(newChannelId, currentChannelId) {
    return dispatch => {
        dispatch(loadingMessages());
        dispatch(saveChangeChannel({ id: newChannelId }));

        console.log(currUser.roomSubscriptions);
        // close current subscription (ACTION)
        unsubscribeFromChannel(currentChannelId);

        //open new subscription to new channel
        subscribeToChannel(newChannelId, dispatch)
            .then(currRoom => {
                console.log(`subscribed to room with room id: ${currRoom.id}`);

                dispatch(saveAllChatData(currUser.rooms, currRoom));
                return fetchMessages(currRoom);
            })
            .then(messages => {
                dispatch(saveMessages(messages));
                dispatch(finishedLoadingMessages());
            })
            .catch(error => console.log(error));
    };
}

function sendMessage(messageText, channelId) {
    return dispatch => {
        currUser
            .sendMessage({
                text: messageText,
                roomId: channelId
            })
            .then(() => {})
            .catch(err => {
                toastr.error("Error sending message");
            });
    };
}

function createChannel(members, name, creatorId, isPrivate, currentChannelId) {
    return dispatch => {
        fetch("http://localhost:3001/createchannel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                creator: creatorId,
                teamMembers: members,
                channelName: name,
                isPrivate: !isPrivate
            })
        })
            .then(response => {
                return response.json();
            })
            .then(roomObj => {
                console.log(roomObj);
                console.log(`channel created on server with name: ${roomObj.name}`);

                dispatch(addNewChannel(roomObj));
                dispatch(switchToChannel(roomObj.id, currentChannelId));
                //TODO: add new group channel to project on Parse
            })
            .catch(error => console.error("error", error));
    };
}

/**************************PRIVATE FUNCTIONS */

function subscribeToChannel(channelId, dispatch) {
    console.log("in subscribetochannel");
    return currUser.subscribeToRoom({
        roomId: channelId,
        messageLimit: 0,
        hooks: {
            onNewMessage: message => {
                dispatch(saveMessageSuccess(message, message.sender));
            }
        }
    });
}

function unsubscribeFromChannel(channelId) {
    return dispatch => {
        if (channelId) {
            currUser.roomSubscriptions[channelId].cancel();
        }
    };
}

function fetchMessages(channel) {
    return currUser.fetchMessages({
        roomId: channel.id,
        direction: "older",
        limit: 100
    });
}
/********ACTION CREATORS***************/

function addNewChannel(channel) {
    return { type: types.ADD_NEW_CHANNEL, req: channel };
}

function saveMessages(messages) {
    return { type: types.SAVE_ALL_MESSAGES, req: messages };
}

function saveChangeChannel(currRoom) {
    return { type: types.SAVE_NEW_ACTIVE_CHANNEL, req: currRoom };
}
function loadingMessages() {
    return { type: types.LOADING_CHAT_MESSAGES, req: null };
}

function finishedLoadingMessages() {
    return { type: types.FINISHED_LOADING_CHAT_MESSAGES, req: null };
}

function clearSoftChatState() {
    return { type: types.CLEAR_SOFT_CHAT_STATE, req: null };
}

function clearChatState() {
    return { type: types.CLEAR_CHAT_STATE, req: null };
}

function saveAllChatData(userChannels, currChannel) {
    return { type: types.SAVE_ALL_CHAT_DATA_SUCCESS, req: { userChannels, currChannel } };
}

function saveMessageSuccess(message, sender) {
    return { type: types.SAVE_MESSAGE_SUCCESS, req: { message, sender } };
}

function retrieveChannelsRequest(currentUser) {
    return { type: types.RETRIEVE_CHANNELS_REQUEST, req: currentUser };
}

function retrieveChannelsSuccess(currentUser) {
    return { type: types.RETRIEVE_CHANNELS_SUCCESS, req: currentUser };
}
