import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    socketConnected: false,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setSocketConnectedAction: (state, action) => {
            const {payload} = action;
            const {connected} = payload
            state.socketConnected =connected
        }
    }
})

export const {
    setSocketConnectedAction
} = appSlice.actions;

export default appSlice.reducer;