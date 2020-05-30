import { ACTION, ROUNDS } from '../constants'

const init = {
  userInputs: [],
  // { words: [strings], owner: { teamID: id, member: {member} } }
  teams: [],
  // { id: id, name: string, members: [members], score: number, powerPoints: number }
}

export function reducer(state = init, action) {
  switch (action.type) {
    case ACTION.RESTART:
      return init
    case ACTION.SAVE_TEAMS:
      return { ...state, teams: action.payload }
    case ACTION.SAVE_WORDS:
      return {
        ...state,
        userInputs: [...state.userInputs, ...action.payload],
      }
    default:
      return state
  }
}
