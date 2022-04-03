import React from 'react';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import copy from 'copy-to-clipboard'
import constants from 'renderer/config/constants';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const {KATALK_MESSAGE_REGEXP} = constants;
const {REGEXP_DATE, REGEXP_MESSAGE} = KATALK_MESSAGE_REGEXP;

const isDate = message => REGEXP_DATE.test(message);
const isMessage = message => REGEXP_MESSAGE.test(message);

const MessageContainer = styled.div``
const ChatContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
const DateMessage = styled.div`
    display: inline-block;
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 18px;
    color: yellow;
    opacity: 0.8;
    user-select: none;
`
const Title = styled.div`
    font-size: 12px;
    color: lightgrey;
    margin-left: 10px;
    margin-top: 5px;
    user-select: none;
`
const Message = styled.div`
    white-space: pre-line;
    margin-left: 60px;
`
const StyledIconButton = styled(IconButton)`
    padding: 3px !important;
    padding-left: 10px !important;
`

const splitMessage = message => {
    const [result]  = [...message.matchAll(REGEXP_MESSAGE)];
    if(Array.isArray(result)){
        const [originalMessage, whoStr, timeStr, restStr] = result;
        return [whoStr, timeStr, restStr]
    }
    return []
}

const KatalkMessage = props => {
    const {message} = props;
    const [open, setOpen] = React.useState(false);
    const isDateMessage = isDate(message);
    const [whoStr, timeStr, restStr] = splitMessage(message);
    const handleTooltipClose = () => setOpen(false)
    // const handleTooltipOpen = () => setOpen(true)
    const clickCopy = React.useCallback(() => {
      const copied = copy(restStr)
      setOpen(open => copied)
    },[setOpen])
    return (
        <MessageContainer>
            {isDateMessage ? (
                <DateMessage>{message}</DateMessage>
            ): whoStr === undefined ? (
                <Title>{message}</Title>
            ): (
                <React.Fragment>
                    <Title>{whoStr}{timeStr}</Title>
                    <ChatContainer>
                      <Message>{restStr}</Message>
                      <ClickAwayListener onClickAway={handleTooltipClose}>
                        <Tooltip
                          PopperProps={{
                            disablePortal: true,
                          }}
                          onClose={handleTooltipClose}
                          open={open}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          title="Copied"
                          placement='right'
                          arrow
                        >
                          {/* <CopyToClipboard value={restStr}> */}
                            <StyledIconButton onClick={clickCopy} sx={{color: 'white'}}>
                              <ContentCopyIcon fontSize="small"></ContentCopyIcon>
                            </StyledIconButton>
                          {/* </CopyToClipboard> */}
                        </Tooltip>
                      </ClickAwayListener>
                    </ChatContainer>
                </React.Fragment>
            )}
        </MessageContainer>
    )
}

export default React.memo(KatalkMessage)
