import { createStore, combineReducers } from 'redux'
import { reducer } from './reducers'

// const rootReducer = combineReducers({
//   game,
//   teams,
//   players,
// })

export const store = createStore(reducer)
