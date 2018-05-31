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
                chatkitUser: action.req.currUser,
                channelList: action.req.userChannels,
                currentChannel: action.req.currChannel
            });
        default:
            return state;
    }
}
