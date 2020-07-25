import { createAction } from 'redux-actions';

import {
    FETCH_CART,
    SET_CART,
} from './constants';

export function fetchCart(cart) {
    return {
        type : FETCH_CART,
        cart  : cart
    };
};

export function setCart(res) {
    return {
        type : SET_CART,
        res  : res
    };
};
