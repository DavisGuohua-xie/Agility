import * as types from "./actionTypes";
import * as ajaxActions from "./ajaxActions";

import Chatkit from "@pusher/chatkit";
import toastr from "../components/common/toastrConfig";

export const chatActions = {
    instantiateChatkit,
    login,
    connectChatkit,
    reset,
    sendMessage,
    switchToChannel,
    createChannel,
    logoff
};

const MAX_MESSAGES_RETRIEVE = 100;

let chatManager = null;
let currUser = null;
let roomSubs = [];

const SERVER_URL = "http://localhost:3001";

function instantiateChatkit(chatkitUsername) {
    return dispatch => {
        chatManager = new Chatkit.ChatManager({
            instanceLocator: "v1:us1:dae44b3a-7d46-4d6b-8894-1302096c409d",
            userId: chatkitUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url: `${SERVER_URL}/authenticate`
            })
        }); // instantiate chatmanager instance on this client
    };
}

function login(chatkitUsername, firstName, lastName) {
    return dispatch => {
        dispatch(loadingMessages());
        fetch(`${SERVER_URL}/users`, {
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

function connectChatkit(publicChannels) {
    return dispatch => {
        chatManager
            .connect()
            .then(currentUser => {
                console.log("current user: ", currentUser.rooms);
                currUser = currentUser;
                let currChannel = publicChannels[0];

                return currentUser.joinRoom({ roomId: currChannel });
            })
            .then(room => {
                console.log(`joined room with room id: ${room.id}`);
                console.log("\n\n\n\nROOMS\n\n\n\n");
                console.log(currUser.rooms);

                return subscribeToChannel(room.id, dispatch);
            })
            .then(currRoom => {
                console.log(`subscribed to room with room id: ${currRoom.id}`);
                console.log(currRoom.users);

                roomSubs.push(currRoom.id);
                dispatch(saveAllChatData(currUser.rooms, currRoom));
                dispatch(finishedLoadingMetadata());
                return fetchMessages(currRoom);
            })
            .then(messages => {
                console.log(messages);
                dispatch(saveMessages(messages));
                dispatch(finishedLoadingMessages());
            })
            .catch(error => {
                console.log(error);
            });
    };
}

function reset(currUser, currentRoom, softClear, dispatch) {
    unsubscribeFromChannel(currentRoom);
    roomSubs.splice(roomSubs.indexOf(currentRoom), 1);
    if (softClear) {
        dispatch(clearSoftChatState());
    } else {
        dispatch(clearChatState());
    }
}

function switchToChannel(newChannelId, currentChannelId) {
    return dispatch => {
        dispatch(loadingMessages());

        console.log("room subs");
        console.log(currUser.roomSubscriptions);
        // close current subscription (ACTION)
        reset(currUser, currentChannelId, true, dispatch);
        dispatch(saveChangeChannel({ id: newChannelId }));

        //open new subscription to new channel
        subscribeToChannel(newChannelId, dispatch)
            .then(currRoom => {
                console.log(`subscribed to room with room id: ${currRoom.id}`);

                dispatch(saveAllChatData(currUser.rooms, currRoom));
                dispatch(finishedLoadingMetadata());
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
        console.log("in chatActions sendMessage");
        currUser
            .sendMessage({
                text: messageText,
                roomId: channelId
            })
            .catch(err => {
                toastr.error("Error sending message");
            });
    };
}

function createChannel(members, name, creatorId, isPrivate, currentChannelId, projId, idNameMap) {
    return dispatch => {
        let chatkitMembers = !isPrivate
            ? members.map(user => user + projId)
            : members.map(user => user.username + projId);
        fetch(`${SERVER_URL}/createchannel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                creator: creatorId,
                teamMembers: chatkitMembers,
                channelName: name,
                isPrivate: !isPrivate,
                idNameMap: idNameMap
            })
        })
            .then(response => {
                console.log("in response");
                if (response.status >= 400) {
                    console.error(response);
                    throw "error";
                }

                return response.json();
            })
            .then(roomObj => {
                console.log(roomObj);
                console.log(`channel created on server with name: ${roomObj.name}`);

                dispatch(addNewChannel(roomObj));
                dispatch(switchToChannel(roomObj.id, currentChannelId));
                //TODO: add new group channel to project on Parse
            })
            .catch(error => {
                toastr.error("Could not create private room");
            });
    };
}

function logoff() {
    return dispatch => {
        Object.keys(currUser.roomSubscriptions).forEach(channelId => {
            unsubscribeFromChannel(channelId);
        });

        roomSubs = [];
        console.log("after logging off");
        console.log(currUser.roomSubscriptions);
    };
}

export default function createChannelNewProject() {
    return fetch(`${SERVER_URL}/createchannel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            creator: "root",
            teamMembers: [],
            channelName: "general",
            isPrivate: false
        })
    }).then(response => {
        console.log("in response");
        if (response.status >= 400) throw "error";

        return response.json();
    });
}

/**
 * Sign up all project members of new project on chatkit.
 *
 * @param {Array} project_members list of project members as follows
 * (exactly named properties in exact order)
 *      [ {first_name, last_name, username, projectID}, ... ]
 */
export function createChatkitUsers(project_members) {
    console.log("\n\n\n\n\n\n\n\n============================");
    console.log(project_members);
    console.log("\n\n\n\n\n\n\n\n============================");

    fetch(`${SERVER_URL}/createusers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            project_members: project_members
        })
    })
        .then(response => {})
        .catch(error => console.error("ERRORORROROROR", error));
}

/**************************PRIVATE FUNCTIONS*****************************/

function subscribeToChannel(channelId, dispatch) {
    console.log(`in subscribetochannel channelId: ${channelId}`);
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
    console.log(channelId);
    currUser.roomSubscriptions[channelId].cancel();
    console.log("in unsub");
    console.log(channelId);
}

function fetchMessages(channel) {
    return currUser.fetchMessages({
        roomId: channel.id,
        direction: "older",
        limit: 100
    });
}
/***************ACTION CREATORS***************/

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

function finishedLoadingMetadata() {
    return { type: types.FINISHED_LOADING_CHAT_METADATA, req: null };
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
