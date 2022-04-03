import React from 'react';
import styled from 'styled-components';
import useAppState from 'renderer/hooks/useAppState';

const HeaderContainer = styled.div`
    background: #340303;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`
const StyledTitle = styled.div`
    font-size: 40px;
    width: 100%;
`
const StyledText = styled.div`
    margin-left: auto;
    margin-right: 10px;
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.connected ? 'green':'red'};
`

const Header = props => {
  const {socketConnected} = useAppState();
  return (
    <HeaderContainer>
        <StyledTitle>카카오톡 수신</StyledTitle>
        <StyledText connected={socketConnected}>{socketConnected ? 'Connected':'Disconnected'}</StyledText>
    </HeaderContainer>
  )
}
export default React.memo(Header);
