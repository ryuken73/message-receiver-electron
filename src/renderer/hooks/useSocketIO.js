import React from 'react';
import socketClient from 'socket.io-client';
import constants from 'renderer/config/constants';
const {EVENT_NEW_MESSAGES} = constants

export default function useSocketClient(props) {
    const {
        hostAddress='http://127.0.0.1',
        setSocketConnected,
    } = props
    const [socket, setSocket] = React.useState(null);
    React.useEffect(() => {
        const socket = socketClient.connect(hostAddress);
        socket.on('connect', () => {
            console.log('connected');
            setSocketConnected(true)
            setSocket(socket);
            socket.emit('put:connect', 'client')
        });
        socket.on('disconnect', reason => {
            console.log('disconnected: ', reason)
            setSocketConnected(false)
        })
        return () => {
            socket.disconnect();
        }
    },[hostAddress])
    return {socket}
}
