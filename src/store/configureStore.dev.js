import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";


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
    return applyMiddleware(thunk,consoleMessages)(createStore)(rootReducer,initialState);
}
