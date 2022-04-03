// import { render } from 'react-dom';
// import App from './App';

// render(<App />, document.getElementById('root'));

import React from 'react';
import ReactDOM from 'react-dom';
import 'renderer/index.css';
import App from 'renderer/App';
import {store} from 'renderer/store';
import {Provider} from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.myPing();
