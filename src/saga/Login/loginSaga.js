import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  SEARCH_USERNAME_REQUEST,
  searchUsernameSuccess,
  searchUsernameFailure,
  LOGIN_REQUEST,
  loginSuccess,
  loginFailure,
} from '../../action/action';
const errors = {
  user_pass: "Username not found.",
  Incorrect_pass: "Incorrect password."
};

function* searchUsernameSaga(action) {
  try {
    const response = yield call(axios.post, process.env.REACT_APP_SEARCH_USERNAME, {
      username: action.payload.username,
    });
    if (response.data.length === 0) {
      yield put(searchUsernameFailure(errors.user_pass));
    } else if (response.data.length > 0) {
      yield put(searchUsernameSuccess(response.data));
    }
  } catch (error) {
    yield put(searchUsernameFailure(error));
  }
}

function* loginSaga(action) {
  try {
    const res = yield call(axios.post, process.env.REACT_APP_LOGIN, {
      username: action.payload.username,
      password: action.payload.password,
    });
    if (res.data.result.length === 0) {
      localStorage.clear();
      yield put(loginFailure(errors.Incorrect_pass));
    } else {
      const secretID = res.data.result[0].SecretID;
      yield put(loginSuccess(res.data.token, secretID, res.data));
    }
  } catch (error) {
    yield put(loginFailure(error.message || 'An error occurred.'));
  }
}

function* rootSaga() {
  yield takeLatest(SEARCH_USERNAME_REQUEST, searchUsernameSaga);
  yield takeLatest(LOGIN_REQUEST, loginSaga);
}

export default rootSaga;
