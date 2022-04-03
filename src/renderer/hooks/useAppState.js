import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setSocketConnectedAction} from 'renderer/slices/appSlice';

export default function useAppState() {
    const dispatch = useDispatch();
    const socketConnected = useSelector(state => state.app.socketConnected);

    const setSocketConnected = React.useCallback(connected => {
        dispatch(setSocketConnectedAction({connected}));
    },[dispatch])

    return {
        socketConnected,
        setSocketConnected
    }
}
