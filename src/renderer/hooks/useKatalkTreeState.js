import React from 'react';
import MD5 from 'crypto-js/md5';
import {useSelector, useDispatch} from 'react-redux';
import constants from 'renderer/config/constants'
import {
    setKatalkTopFolderAction,
    setSelectedNodeIdAction,
    addKatalkRoomAction,
    delKatalkRoomAction,
    // addKatalkMessageAction,
    appendKatalkMessagesAction,
    unshiftKatalkMessagesAction,
    increaseNewMessageCountAction,
    clearKatalkMessageAction,
    resetNewMessageCountAction
} from 'renderer/slices/katalkTreeSlice';
import { Difference } from '@mui/icons-material';

const {KATALK_TOP_FOLDER_NAME} = constants;

export default function useKatalkTreeState() {
    const dispatch = useDispatch();
    const katalkTopFolder = useSelector(state => state.katalkTree.katalkTopFolder);
    const katalkRooms = useSelector(state => state.katalkTree.katalkRooms);
    const katalkMessages = useSelector(state => state.katalkTree.katalkMessages);
    const selectedNodeId = useSelector(state => state.katalkTree.selectedNodeId);
    const selectedRoomName = katalkRooms.find(katalkRoom => katalkRoom.nodeId === selectedNodeId)?.roomName;
    const messagesOfSelectedRoom = katalkMessages[selectedRoomName];
    const orderedKatalkRooms = React.useMemo(() => [...katalkRooms], [katalkRooms]);
    // const orderedKatalkRooms = [...katalkRooms]
    orderedKatalkRooms.sort((a, b) => b.lastUpdatedTimestamp - a.lastUpdatedTimestamp);

    const initializeTopFolder = React.useCallback(() => {
        dispatch(setKatalkTopFolderAction({name: KATALK_TOP_FOLDER_NAME}));
    },[])

    const addKatalkRoom = React.useCallback(roomName => {
        if(katalkRooms.some(room => room.roomName === roomName)) return;
        dispatch(addKatalkRoomAction({roomName}));
    },[dispatch, katalkRooms])

    const delKatalkRoom = React.useCallback(roomName => {
        dispatch(delKatalkRoomAction({roomName}));
    },[dispatch])

    const compareWithCurrentMessages = React.useCallback((roomName, newMessages) => {
        console.log(`compare: ${roomName} ${newMessages}`)
        const currentMessages = katalkMessages[roomName] || [];
        const currentMessagesHash = MD5(currentMessages.join()).toString();
        const newMessagesHash = MD5(newMessages.join()).toString();
        // initial load
        if(currentMessages.length === 0){
            return [constants.NEW_MESSAGE_TYPE.INITIAL, newMessages]
        }
        console.log(`diff hash: ${currentMessagesHash}, ${newMessagesHash}`)
        console.log(`diff length: ${currentMessages.length}, ${newMessages.length}`)
        // console.log(`diff message:`, currentMessages, newMessages);
        // no messages added. nothing changed
        if(currentMessagesHash === newMessagesHash){
            return [constants.NEW_MESSAGE_TYPE.EQUAL, []]
        }
        const currentStart = currentMessages.values().next().value;
        const newStart = newMessages.values().next().value;
        console.log(`diff:`, currentStart, newStart)
        // new message appended to bottom
        if(currentStart === newStart){
            const currentEndMessage = [...currentMessages].reverse().values().next().value;
            const newFromIndex = newMessages.findIndex(message => message === currentEndMessage)
            const newAppened = newMessages.slice(newFromIndex+1);
            return [constants.NEW_MESSAGE_TYPE.NEW_BOTTOM, newAppened]
        }
        const currentEnd = [...currentMessages].reverse().values().next().value;
        const newEnd = [...newMessages].reverse().values().next().value;
        if(currentEnd === newEnd){
            // new message added to begining of chatroom
            if(newMessages.includes(currentStart)){
                const newToIndex = newMessages.findIndex(message => message === currentStart);
                const newFrontMessages = newMessages.slice(0, newToIndex);
                return [constants.NEW_MESSAGE_TYPE.NEW_TOP, newFrontMessages]
            // no messages added but shrink (happens when re-open chatroom)
            } else {
                return [constants.NEW_MESSAGE_TYPE.EQUAL_SHIFT_BOTTOM, []]
            }
        }
        if(newMessages.includes(currentStart)){
            const currentEndMessage = [...currentMessages].reverse().values().next().value;
            const newFromIndex = newMessages.findIndex(message => message === currentEndMessage)
            const newAppened = newMessages.slice(newFromIndex+1);
            return [constants.NEW_MESSAGE_TYPE.NEW_TOP_AND_BOTTOM, newAppened]
        }
        if(newMessages.includes(currentEnd)){
            const currentEndMessage = [...currentMessages].reverse().values().next().value;
            const newFromIndex = newMessages.findIndex(message => message === currentEndMessage)
            const newAppened = newMessages.slice(newFromIndex+1);
            return [constants.NEW_MESSAGE_TYPE.NEW_SHIFT_BOTTOM, newAppened]
        } else {
            return [constants.NEW_MESSAGE_TYPE.NEW_JUMP_TO_BOTTOM, newMessages]
        }
    },[katalkMessages])

    const appendKatalkMessages = React.useCallback((roomName, messages) => {
        dispatch(appendKatalkMessagesAction({roomName, messages}))
        dispatch(increaseNewMessageCountAction({roomName, messages}))
    },[dispatch])

    const unshiftKatalkMessages = React.useCallback((roomName, messages) => {
        dispatch(unshiftKatalkMessagesAction({roomName, messages}))
        dispatch(increaseNewMessageCountAction({roomName, messages}))
    },[dispatch])

    // const addKatalkMessages = React.useCallback((roomName, messages) => {
    //     messages.forEach(message => {
    //         dispatch(addKatalkMessageAction({roomName, message}));
    //     })
    // },[dispatch])

    const clearKatalkMessages = React.useCallback(roomName => {
        dispatch(clearKatalkMessageAction({roomName}))
    },[dispatch])

    const setSelecteNodeId = React.useCallback(nodeId => {
        dispatch(setSelectedNodeIdAction({nodeId}));
        dispatch(resetNewMessageCountAction({nodeId}));
    },[dispatch])

    const getNumberOfRoomMessages = React.useCallback(roomName => {
        const messages = katalkMessages[roomName] || []
        return messages.length
    },[katalkMessages])

    const getNumberOfNewMessages = React.useCallback(roomName => {
      const katalkRoom = katalkRooms.find(room => room.roomName === roomName);
      console.log(katalkRoom)
      return katalkRoom.numberOfNewMessages;
    },[katalkRooms])

    return {
        katalkTopFolder,
        katalkRooms,
        katalkMessages,
        selectedNodeId,
        selectedRoomName,
        messagesOfSelectedRoom,
        orderedKatalkRooms,
        initializeTopFolder,
        addKatalkRoom,
        delKatalkRoom,
        // addKatalkMessages,
        compareWithCurrentMessages,
        appendKatalkMessages,
        unshiftKatalkMessages,
        clearKatalkMessages,
        setSelecteNodeId,
        getNumberOfRoomMessages,
        getNumberOfNewMessages
    }
}
