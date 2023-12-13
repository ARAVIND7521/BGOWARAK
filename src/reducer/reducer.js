import {
    SEARCH_USERNAME_SUCCESS,
    SEARCH_USERNAME_FAILURE,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT
} from '../action/action';
import storage from 'redux-persist/lib/storage';

const initialState = {
    searchData: null,
    token: null,
    secretID: null,
    error: null
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_USERNAME_SUCCESS:
            return { ...state, searchData: action.payload.data, error: null };

        case SEARCH_USERNAME_FAILURE:
            return { ...state, error: action.payload.error, searchData: null, secretID: null, token: null };

        case LOGIN_SUCCESS:
            const result = action.payload.data.result[0];

            if (result.SecretID === null) {
                return { ...state, searchData: action.payload.data, token: action.payload.token, error: null, secretID: null };
            } else {
                return { ...state, searchData: action.payload.data, token: action.payload.token, secretID: result.SecretID, error: null };
            }
        case LOGIN_FAILURE:
            return { ...state, error: action.payload };

        case LOGOUT:
            storage.removeItem('persist:root');
            return { ...state, searchData: null, token: null, secretID: null, error: null };

        default:
            return state;
    }
};

export default rootReducer;  