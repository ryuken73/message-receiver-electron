import React from 'react';
import styled from 'styled-components';
import useAppState from 'renderer/hooks/useAppState';

const HeaderContainer = styled.div`
    // background: #340303;
    background: #280808;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`
const StyledTitle = styled.div`
    font-size: 40px;
    width: 100%;
`
const RightMenu = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: 10px;
`
const StyledText = styled.div`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.connected ? 'green':'red'};
    width: 200px;
`
const StyledUrl = styled.div`
    font-size: 15px;
    font-weight: bold;
    color: ${props => props.connected ? 'green':'red'};
    width: 200px;
`

const Header = props => {
  const {url} = props;
  const {socketConnected} = useAppState();
  return (
    <HeaderContainer>
        <StyledText ></StyledText>
        <StyledTitle>카카오톡 수신</StyledTitle>
        <RightMenu>
          <StyledText connected={socketConnected}>{socketConnected ? 'Connected':'Disconnected'}</StyledText>
          <StyledUrl connected={socketConnected}>[{url}]</StyledUrl>
        </RightMenu>
    </HeaderContainer>
  )
}
export default React.memo(Header);
