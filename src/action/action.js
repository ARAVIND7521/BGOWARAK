export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const SEARCH_USERNAME_REQUEST = 'SEARCH_USERNAME_REQUEST';
export const SEARCH_USERNAME_SUCCESS = 'SEARCH_USERNAME_SUCCESS';
export const SEARCH_USERNAME_FAILURE = 'SEARCH_USERNAME_FAILURE';
export const LOGOUT = 'LOGOUT';

export const loginRequest = (username, password) => ({
  type: LOGIN_REQUEST,
  payload: { username, password }
});

export const loginSuccess = (token, secretID, data) => ({
  type: LOGIN_SUCCESS,
  payload: { token, secretID, data }
});

export const loginFailure = (errorMessage) => ({
  type: LOGIN_FAILURE,
  payload: errorMessage
});

export const searchUsernameRequest = (username) => ({
  type: SEARCH_USERNAME_REQUEST,
  payload: { username }
});

export const searchUsernameSuccess = (data) => ({
  type: SEARCH_USERNAME_SUCCESS,
  payload: { data }
});

export const searchUsernameFailure = (error) => ({
  type: SEARCH_USERNAME_FAILURE,
  payload: { error }
});

export const logout = () => ({
  type: LOGOUT
});
