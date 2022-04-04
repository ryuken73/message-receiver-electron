import React from 'react';
import styled, {keyframes, css} from 'styled-components';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import TreeItem from '@mui/lab/TreeItem';
import useKatalkTreeState from 'renderer/hooks/useKatalkTreeState';

const ShowUpdated = keyframes`
  from {
    color: yellow;
    font-weight: bold;
  }
  to {
    color: white;
  }
`
const updateStyle = css`
  animation-name: ${ShowUpdated};
  animation-delay: 0.5s;
  animation-duration: 5s;
  animation-fill-mode: both;
`
const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`
const StyledIconButton = styled(IconButton)`
    padding: 3px !important;
`
const StyledText = styled.div`
    height: 24px;
    color: yellow;
    font-weight: bold;
    font-size: 15px;
`
const itemLabel = css`
    width: auto;
    padding-right: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 200px;
    border-radius: 3px;
`


const StyledTreeItem = styled(TreeItem)`
  width: fit-content;
  .MuiTreeItem-content {
    width: fit-content;
    .MuiTreeItem-iconContainer {
      width: 0px;
    }
    .MuiTreeItem-label {
      ${itemLabel};
    }
    &.Mui-focused {
      background: transparent !important;
      .MuiTreeItem-label {
        ${itemLabel};
        background: darkgreen;
      }
    }
    &.Mui-focused.Mui-selected {
      background: transparent !important;
      .MuiTreeItem-label {
        ${itemLabel};
        background: maroon;
      }
    }
    &.Mui-selected {
      background: transparent !important;
      .MuiTreeItem-label {
        ${itemLabel};
        background: maroon;
      }
    }
  }
  ${props => (props.index === 0 && updateStyle)};
`

const KatalkRoom = props => {
    const {label:roomName, lastUpdatedTimestamp} = props;
    const [lastUpdated, setLastUpdated] = React.useState();
    React.useEffect(() => {
        setLastUpdated(lastUpdatedTimestamp)
    },[lastUpdatedTimestamp])
    const {
      delKatalkRoom,
      getNumberOfRoomMessages,
      getNumberOfNewMessages
    } = useKatalkTreeState();
    const clickRemoveRoom = React.useCallback(() => {
        delKatalkRoom(roomName);
    },[delKatalkRoom, roomName])
    const newMessageCount = getNumberOfNewMessages(roomName);
    return (
        <Container>
            <StyledIconButton onClick={clickRemoveRoom} sx={{color: 'red'}}>
                <ClearIcon fontSize="small"></ClearIcon>
            </StyledIconButton>
            <StyledTreeItem
                {...props}
            >
            </StyledTreeItem>
            {newMessageCount !== 0 && (
              <StyledText>
                  [{getNumberOfNewMessages(roomName)}]
              </StyledText>
            )}
        </Container>
    )
}

export default React.memo(KatalkRoom)
