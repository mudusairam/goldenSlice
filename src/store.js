// store.js
import { createStore } from 'redux';

// Initial state
const initialState = {
    user: null,
};

// Reducer
function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

// Create store
const store = createStore(userReducer);

export default store;
