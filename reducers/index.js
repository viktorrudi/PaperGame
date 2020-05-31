import { ACTION, ROUNDS } from '../constants'

const init = {
  gameSettings: {
    roundTimer: 30,
    powerPointsPerRound: 5,
    minWords: 3,
  },
  userInputs: [],
  // { words: [strings], owner: { teamID: id, member: {member} } }
  teams: [],
  // { id: id, name: string, members: [members], score: number, powerPoints: number }
}

export function reducer(state = init, action) {
  switch (action.type) {
    case ACTION.RESTART:
      return { ...state, userInputs: init.userInputs, teams: init.userInputs }
    case ACTION.UPDATE_GAME_SETTINGS:
      console.log(action.payload)
      return {
        ...state,
        gameSettings: { ...state.gameSettings, ...action.payload },
      }
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
