import { FETCH_ADDRESS } from '../actions/types';

const initialState = { addressesInfo: [] };
export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_ADDRESS:
      return { addressesInfo: action.payload };
    default:
      return state;
  }
}
