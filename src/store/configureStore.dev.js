import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";


// const intialState =

const consoleMessages = store => next => action => {
  let result
  console.groupCollapsed(`dispatching action ${action.type}`)
  console.log('BEFORE: ', store.getState())

  result = next(action)

  console.log('AFTER: ', store.getState())

  console.groupEnd();


  return result;
}

export default function configureStore(initialState) {
      var store =   createStore(rootReducer, initialState, applyMiddleware(thunk, consoleMessages))
      store.subscribe(()=>{
        const state = JSON.stringify(store.getState())
        localStorage['redux-store'] = state
      })

      return store
    // return applyMiddleware(thunk,consoleMessages)(createStore)(rootReducer,initialState);
}
