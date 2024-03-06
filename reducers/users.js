import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        user: {},
        documents: [],
        trips: [],
        selectedTripId: null
    }
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.user = action.payload;
        },
        logout: (state) => {
            state.value.user = {};
        },
        initTrips: (state, action) => {
            state.value.trips = action.payload;
        },
        selectTrip: (state, action) => {
            state.value.selectedTripId = action.payload.tripId;
            //console.log('Trip selected: ', action.payload.tripId)
        },
        addTrip: (state, action) => {
            state.value.trips.push(action.payload);
        },
    },
});

// Action creators are generated for each case reducer function
export const { login, addTrip, initTrips, selectTrip, logout } = userSlice.actions;

export default userSlice.reducer;
