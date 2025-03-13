import { createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { userReducer } from './reducers/userReducers';
import { bookReducer } from './reducers/bookReducer';
import { taskReducer } from './reducers/taskReducer';
import { productReducer } from './reducers/productReducer';

const reducer = combineReducers({
    user: userReducer,
    book: bookReducer,
    tasks: taskReducer,
    productData: productReducer,
})

const initialState = {};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;