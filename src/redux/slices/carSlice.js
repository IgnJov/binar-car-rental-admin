import { createSlice } from '@reduxjs/toolkit';
import Axios from "axios";

const initialState = {
    cars: [],
    selectedCar: null,
    loading: false,
    error: null
}

const carSlice = createSlice({
    name: 'car',
    initialState,
    reducers: {
        fetchCarsRequest: (state, action) => {
            state.loading = true
        },
        fetchCarsSuccess: (state, action) => {
            state.loading = false
            state.cars = action.payload
        },
        fetchCarsFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        selectCar: (state, action) => {
            state.selectedCar = action.payload
        },
        deselectCar: (state, action) => {
            state.selectedCar = null
        }
    }
});

export const { fetchCarsRequest, fetchCarsSuccess, fetchCarsFailure, selectCar, deselectCar } = carSlice.actions;

export default carSlice.reducer;