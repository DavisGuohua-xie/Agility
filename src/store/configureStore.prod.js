import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";

export default function configureStore(initialState) {

    var store =  createStore(rootReducer, initialState, applyMiddleware(thunk));

    store.subscribe(()=>{
      const state = JSON.stringify(store.getState())
      localStorage['redux-store'] = state
    })

    return store;
}
