import React from 'react'
import styled from '@emotion/styled';
import KatalkMessage from 'renderer/KatalkMessage';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import useKatalkTreeState from 'renderer/hooks/useKatalkTreeState';

const RightContainer = styled.div`
    box-sizing: border-box;
    height: 100%;
    background: #280808;
    text-align: left;
    padding: 20px;
    font-size: 15px;
    overflow-x: auto;
    position: relative;
`
const IconContainer = styled.div`
    position: fixed;
    top: 115px;
    right: 30px;
`
function RightPane() {
    const {
        selectedRoomName,
        messagesOfSelectedRoom=[],
        clearKatalkMessages
    } = useKatalkTreeState();

    const messageEndRef = React.useRef(null);
    const scrollToBottom = React.useCallback(()=>{
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    },[messageEndRef])

    React.useEffect(() => {
        scrollToBottom()
    },[messagesOfSelectedRoom, scrollToBottom])

    const clearRoomMessages = React.useCallback(() => {
        clearKatalkMessages(selectedRoomName)
    },[selectedRoomName, clearKatalkMessages])
    return (
        <RightContainer>
            <Tooltip title="Remove all messages" placement="left-end">
                <IconContainer>
                    <IconButton onClick={clearRoomMessages} sx={{color:'white'}}>
                        <DeleteIcon fontSize="large"></DeleteIcon>
                    </IconButton>
                </IconContainer>
            </Tooltip>
            {messagesOfSelectedRoom.map(message => (
                <KatalkMessage message={message}></KatalkMessage>
            ))}
            <div ref={messageEndRef}></div>
        </RightContainer>
    )
}

export default React.memo(RightPane)
