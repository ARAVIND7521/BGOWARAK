import { all } from 'redux-saga/effects';
import rootSaga from './Login/loginSaga';

export default function* root() {
  yield all([rootSaga()]);
}
