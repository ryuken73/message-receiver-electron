import React from 'react'
import styled from 'styled-components'
import TreeView from '@mui/lab/TreeView';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ClearIcon from '@mui/icons-material/Clear';
import TreeItem from '@mui/lab/TreeItem';
import KatalkRoom from 'renderer/KatalkRoom';
import useConfig from 'renderer/hooks/useConfig';
import useAppState from 'renderer/hooks/useAppState';
import useSocketIO from 'renderer/hooks/useSocketIO';
import useKatalkTreeState from 'renderer/hooks/useKatalkTreeState';
import constants from 'renderer/config/constants';
const {EVENT_NEW_MESSAGES} = constants;

const LeftContainer = styled.div`
    box-sizing: border-box;
    height: 100%;
    background: #382121;
    text-align: left;
    padding-top: 10px;
    overflow-y: auto;
`
const IconGroupContainer = styled.div`
  // width: 100%;
  padding-left: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const StyledIconButton = styled(IconButton)`
  padding: 3px !important;
  color: maroon !important;
`
const StyledTreeView = styled(TreeView)`
  height: auto !important;
`
const StyledTreeItem = styled(TreeItem)`
    width: fit-content;
`
function LeftPane(props) {
    const {url} = props;
    console.log('in LeftPane:', url);
    const {setSocketConnected} = useAppState();
    const {socket} = useSocketIO({hostAddress: url, setSocketConnected});
    const {
        katalkTopFolder,
        katalkRooms,
        orderedKatalkRooms,
        hasUnreadMessages,
        initializeTopFolder,
        addKatalkRoom,
        // addKatalkMessages,
        appendKatalkMessages,
        unshiftKatalkMessages,
        compareWithCurrentMessages,
        setSelecteNodeId,
        resetAllNewMessageCount,
        initializeRoomNMessages
    } = useKatalkTreeState();

    const handleMessages = React.useCallback(newMessages => {
        const {room, messages}  = newMessages
        addKatalkRoom(room);
        const [diffType, newAdded] = compareWithCurrentMessages(room, messages);
        console.log(`diffType: ${diffType}`);
        if(diffType === constants.NEW_MESSAGE_TYPE.EQUAL){
            return
        }
        if(diffType === constants.NEW_MESSAGE_TYPE.NEW_TOP){
            unshiftKatalkMessages(room, newAdded)
            return
        }
        appendKatalkMessages(room, newAdded)
    },[addKatalkRoom, appendKatalkMessages, unshiftKatalkMessages, compareWithCurrentMessages])

    const handleNodeSelect = React.useCallback((event, nodeId) => {
        setSelecteNodeId(nodeId)
    },[])

    React.useEffect(() => {
        initializeTopFolder();
    },[])

    React.useEffect(() => {
        if(socket === null) return;
        socket.on(EVENT_NEW_MESSAGES, handleMessages)
        return () => {
            socket.off(EVENT_NEW_MESSAGES, handleMessages)
        }
    },[socket, handleMessages])

    console.log(orderedKatalkRooms)

    return (
        <LeftContainer>
            <IconGroupContainer>
              <StyledIconButton onClick={initializeRoomNMessages}>
                <ClearIcon fontSize="large"></ClearIcon>
              </StyledIconButton>
              {hasUnreadMessages ? (
                <StyledIconButton onClick={resetAllNewMessageCount}>
                  <MarkChatUnreadIcon fontSize="large"></MarkChatUnreadIcon>
                </StyledIconButton>
              ):(
                <StyledIconButton>
                  <ChatBubbleIcon fontSize="large"></ChatBubbleIcon>
                </StyledIconButton>
              )}
            </IconGroupContainer>
            <StyledTreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{ height: '100%', flexGrow: 1 }}
              expanded={["0"]}
              onNodeSelect={handleNodeSelect}
            >
                {katalkTopFolder.nodeId !== undefined ? (
                    <StyledTreeItem nodeId={katalkTopFolder.nodeId} label={katalkTopFolder.name}>
                        {orderedKatalkRooms.map((katalkRoom, index) => (
                            <KatalkRoom
                                key={katalkRoom.nodeId}
                                nodeId={katalkRoom.nodeId}
                                label={katalkRoom.roomName}
                                lastUpdatedTimestamp={katalkRoom.lastUpdatedTimestamp}
                                index={index}
                            />
                        ))}
                    </StyledTreeItem>):
                    <div></div>
                }

            </StyledTreeView>
        </LeftContainer>
    )
}

export default React.memo(LeftPane)
