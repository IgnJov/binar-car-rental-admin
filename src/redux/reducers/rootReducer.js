import { combineReducers } from 'redux';
import carReducer from '../slices/carSlice';

const rootReducer = combineReducers({
    car: carReducer,
});

export default rootReducer;