import * as types from "./actionTypes";
import * as ajaxActions from "./ajaxActions";

import Chatkit from "@pusher/chatkit";

export const chatActions = {
    instantiateChatkit,
    login,
    connectChatkit
};

const MAX_MESSAGES_RETRIEVE = 100;

let chatManager = null;

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
                    console.log(
                        `user already on chatkit server with username: ${chatkitUsername}`
                    );
                else if (response.status === 201)
                    console.log(
                        `user created on chatkit server with username: ${chatkitUsername}`
                    );
            })
            .catch(error => console.error("ERRORORROROROR", error));
    };
}

function connectChatkit() {
    return dispatch => {
        let currUser;

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

                return currUser.subscribeToRoom({
                    roomId: room.id,
                    messageLimit: 100,
                    hooks: {
                        onNewMessage: message => {
                            dispatch(saveMessageSuccess(message, message.sender));
                        }
                    }
                });
            })
            .then(currRoom => {
                console.log(`subscribed to room with room id: ${currRoom.id}`);

                dispatch(saveAllChatData(currUser, currUser.rooms, currRoom));
            })
            .catch(error => {
                console.log(error);
            });
    };
}

function saveAllChatData(currUser, userChannels, currChannel) {
    return { type: types.SAVE_ALL_CHAT_DATA_SUCCESS, req: { currUser, userChannels, currChannel } };
}

function saveMessageSuccess(message, sender) {
    return { type: types.SAVE_MESSAGE_SUCCESS, req: {message, sender} };
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
