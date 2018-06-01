import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        case types.SAVE_MESSAGE_SUCCESS:
            console.log("saving message");
            console.log(state);
            return state.merge({
                msgList: [
                    ...state.msgList,
                    { ...action.req.message, sender: { ...action.req.sender } }
                ]
            });
        case types.SAVE_ALL_CHAT_DATA_SUCCESS:
            return state.merge({
                channelList: action.req.userChannels,
                currentChannelName: action.req.currChannel.name,
                currentChannelId: action.req.currChannel.id,
                msgList: []
            });
        case types.SAVE_ALL_MESSAGES:
            let messages = action.req;
            let msgList = [];
            for(let i = 0; i < messages.length; i++) 
                msgList.push({...messages[i], sender: messages[i].sender});

            return state.merge({
                msgList: msgList
            });
        case types.SAVE_NEW_ACTIVE_CHANNEL:
            return state.merge({
                currentChannelName: action.req ? action.req.name : null,
                currentChannelId: action.req ? action.req.id : null
            });
        case types.CLEAR_CHAT_STATE:
            return state.merge({
                channelList: [],
                currentChannelName: null,
                currentChannelId: null,
                msgList: []
            });
        case types.CLEAR_SOFT_CHAT_STATE:
            return state.merge({
                msgList: [],
                currentChannelName: null,
                currentChannelId: null
            });
        case types.LOADING_CHAT_MESSAGES:
            return state.merge({
                chat_loading: true
            });
        case types.FINISHED_LOADING_CHAT_MESSAGES:
            return state.merge({
                chat_loading: false
            });
        default:
            return state;
    }
}
