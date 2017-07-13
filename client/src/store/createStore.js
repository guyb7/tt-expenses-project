import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from './promise-middleware'
import * as reducers from './reducers'

export default function(data) {
  var reducer = combineReducers(reducers)
  var finalCreateStore = applyMiddleware(promiseMiddleware)(createStore)
  var store = finalCreateStore(
    reducer,
    data,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

  return store
}
