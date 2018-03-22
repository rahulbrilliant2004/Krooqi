import initialState from './initialState';
import * as types from './../constants/actionTypes';

export default (state = initialState.common, action) => {
  switch (action.type) {
    case types.LOAD_PROPERTY_STATUS_REQUEST:
      return { ...state, loading: true };
    case types.LOAD_PROPERTY_STATUS_SUCCESS:
      return { ...state, loading: false, success: action.properties };
    case types.LOAD_PROPERTY_STATUS_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};
