import './App.css';
import React from 'react';
import SplitPane from 'react-split-pane';
import Header from 'renderer/Header';
import LeftPane from 'renderer/LeftPane';
import RightPane from 'renderer/RightPane';
import styled from 'styled-components';
import constants from 'renderer/config/constants';

const RightContainer = styled.div`
  height: 100%;
  background: darkslategrey;
`

function App() {
  const [config, setConfig] = React.useState({})
  React.useEffect(() => {
      window.electron.ipcRenderer.getCustomConfig()
      .then(customConfig => {
        console.log(customConfig)
        setConfig({
          ...constants,
          ...customConfig
        })
      })
  },[])
  console.log(config)
  return (
    <div className="App">
      <header className="App-header">
        <SplitPane  split="horizontal" defaultSize={100} allowResize={false}>
          <Header></Header>
          <SplitPane split="vertical" defaultSize={350} minSize={350} maxSize={500} step={10}>
            <LeftPane url={config.SOCKET_SERVER_URL}></LeftPane>
            <RightPane></RightPane>
          </SplitPane>
        </SplitPane>
      </header>
    </div>
  );
}

export default App;
