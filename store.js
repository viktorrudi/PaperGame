import { createStore, combineReducers } from 'redux'
import { game, teams, players } from './reducers'

const rootReducer = combineReducers({
  game,
  teams,
  players,
})

export const store = createStore(rootReducer)
