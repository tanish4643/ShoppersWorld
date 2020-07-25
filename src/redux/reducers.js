import { fromJS, List } from 'immutable';
import { handleActions } from 'redux-actions';

import {
    SET_CART,
} from './constants';

const initialState = fromJS({
	cart: null,
});

export default function sales (state = initialState, action) {
    switch (action.type) {
    	case SET_CART:
    		return state.set('cart',action.res);
        default:
            return state;
    }
}
