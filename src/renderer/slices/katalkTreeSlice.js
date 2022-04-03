import {createSlice} from "@reduxjs/toolkit";
import {genSequence} from 'renderer/lib/util';
import constants from 'renderer/config/constants';

const {MAX_RETAIN_MESSAGES} = constants

const initialState = {
    katalkTopFolder: {},
    katalkRooms: [],
    katalkMessages: {},
    selectedNodeId: null
}

const sequence = genSequence();
const getNextId = () => {
    return sequence.next().value.toString();
}
const tailArray = (array, tailCount) => {
    return array.filter((element, index) => {
        return index >= array.length - tailCount
    })
}

export const katalkTreeSlice = createSlice({
    name: 'katalkTree',
    initialState,
    reducers: {
        setKatalkTopFolderAction: (state, action) => {
            const {payload} = action;
            const {name} = payload
            state.katalkTopFolder = {nodeId:"0", name};
        },
        addKatalkRoomAction: (state, action) => {
            const {payload} = action;
            const {roomName} = payload;
            const lastUpdatedTimestamp = Date.now();
            state.katalkRooms.push({nodeId: getNextId(), roomName, lastUpdatedTimestamp});
        },
        delKatalkRoomAction: (state, action) => {
            const {payload} = action;
            const {roomName} = payload;
            state.katalkRooms = state.katalkRooms.filter(room => room.roomName !== roomName);
            state.katalkMessages[roomName] = [];
        },
        appendKatalkMessagesAction: (state, action) => {
            const {payload} = action;
            const {roomName, messages} = payload;
            if(state.katalkMessages[roomName] === undefined){
                state.katalkMessages[roomName] = messages
            } else {
                state.katalkMessages[roomName] = [...state.katalkMessages[roomName], ...messages]
            }
            state.katalkMessages[roomName] = tailArray(state.katalkMessages[roomName], MAX_RETAIN_MESSAGES);
            const katalkRoom = state.katalkRooms.find(katalkRoom => katalkRoom.roomName === roomName)
            katalkRoom.lastUpdatedTimestamp = Date.now();
        },
        unshiftKatalkMessagesAction: (state, action) => {
            const {payload} = action;
            const {roomName, messages} = payload;
            if(state.katalkMessages[roomName] === undefined){
                state.katalkMessages[roomName] = messages
            } else {
                state.katalkMessages[roomName] = [...messages, ...state.katalkMessages[roomName]]
            }
            state.katalkMessages[roomName] = tailArray(state.katalkMessages[roomName], MAX_RETAIN_MESSAGES);
            const katalkRoom = state.katalkRooms.find(katalkRoom => katalkRoom.roomName === roomName)
            katalkRoom.lastUpdatedTimestamp = Date.now();
        },
        addKatalkMessageAction: (state, action) => {
            const {payload} = action;
            const {roomName, message} = payload;
            if(state.katalkMessages[roomName] !== undefined){
                state.katalkMessages[roomName].push(message)
            } else {
                state.katalkMessages[roomName] = [message]
            }
            state.katalkMessages[roomName] = tailArray(state.katalkMessages[roomName], MAX_RETAIN_MESSAGES);
            const katalkRoom = state.katalkRooms.find(katalkRoom => katalkRoom.roomName === roomName)
            katalkRoom.lastUpdatedTimestamp = Date.now();
        },
        clearKatalkMessageAction: (state, action) => {
            const {payload} = action;
            const {roomName} = payload;
            state.katalkMessages[roomName] = [];
        },
        setSelectedNodeIdAction: (state, action) => {
            const {payload} = action;
            const {nodeId} = payload;
            state.selectedNodeId = nodeId;
        }
    }
})

export const {
    setKatalkTopFolderAction,
    setSelectedNodeIdAction,
    addKatalkRoomAction,
    delKatalkRoomAction,
    appendKatalkMessagesAction,
    unshiftKatalkMessagesAction,
    addKatalkMessageAction,
    clearKatalkMessageAction,
} = katalkTreeSlice.actions;

export default katalkTreeSlice.reducer;
