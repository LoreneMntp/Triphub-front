import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {},
    documents: [],
    trips: [],
    selectedTripId: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = {};
        },
        initTrips: (state, action) => {
            state.trips = action.payload;
        },
        selectTrip: (state, action) => {
            state.selectedTripId = action.payload.tripÎd;
        },
        addTrip: (state, action) => {
            state.trips.push(action.payload);
        },
    },
})

// Action creators are generated for each case reducer function
export const { login, addTrip, initTrips, selectTrip, logout } = userSlice.actions

export default userSlice.reducer