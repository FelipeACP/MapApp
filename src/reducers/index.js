import { combineReducers } from 'redux';
import addressReducer from '../reducers/addressReducer';

export default combineReducers({
  addresses: addressReducer,
});
