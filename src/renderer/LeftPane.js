import React from 'react'
import styled from 'styled-components'
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import KatalkRoom from 'renderer/KatalkRoom';
import useAppState from 'renderer/hooks/useAppState';
import useSocketIO from 'renderer/hooks/useSocketIO';
import useKatalkTreeState from 'renderer/hooks/useKatalkTreeState';
import constants from 'renderer/config/constants';
const {SOCKET_SERVER_URL, EVENT_NEW_MESSAGES} = constants;

const LeftContainer = styled.div`
    box-sizing: border-box;
    height: 100%;
    background: #382121;
    text-align: left;
    padding-top: 20px;
    overflow-y: auto;
`
const StyledTreeItem = styled(TreeItem)`
    width: fit-content;
`
function LeftPane() {
    const {setSocketConnected} = useAppState();
    const {socket} = useSocketIO({hostAddress: SOCKET_SERVER_URL, setSocketConnected});
    const {
        katalkTopFolder,
        katalkRooms,
        orderedKatalkRooms,
        initializeTopFolder,
        addKatalkRoom,
        addKatalkMessages,
        appendKatalkMessages,
        unshiftKatalkMessages,
        compareWithCurrentMessages,
        setSelecteNodeId
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
            <TreeView
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

            </TreeView>
        </LeftContainer>
    )
}

export default React.memo(LeftPane)
