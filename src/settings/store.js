import { createStore, applyMiddleware } from 'redux';

import createSagaMiddleware from 'redux-saga';
import getRootReducer from './reducers';
// import rootSaga from './sagas';
import watchersRootSaga from '../redux/sagas';

const sagaMiddleware = createSagaMiddleware();

export default function getStore() {
    const store = createStore(
        getRootReducer,
        applyMiddleware(sagaMiddleware)
    );
    sagaMiddleware.run(watchersRootSaga);

    return store;
}