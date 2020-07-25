import { delay } from 'redux-saga';
import { put, takeLatest, call, all } from 'redux-saga/effects';

import {
    setCart,
} from './actions';

import {
    FETCH_CART
} from './constants'

const asyncCart = function* (payload) {
    const cart = payload.cart;
    localStorage.setItem('cart', JSON.stringify(cart));
    yield put(setCart(cart));
}

const sagaCart = function* () {
    yield takeLatest(FETCH_CART, asyncCart);
}

export default function* watchersRootSaga() {
    yield all ([
        sagaCart(),
    ])
}