import { ACTION } from '../constants'

const init = {
  teams: [],
  // id: 3,
  // name: 'team name',
  // score: 5,
  // color: 'red',
  // members: [2, 6] (player ids),
  // powerPoints: 5
  players: [],
  // id: 5,
  // name: 'Viktor',
  // score: 3
  game: {
    isEnded: true,
    roundType: null,
    currentTeam: null,
    nextTeam: null,
    currentPlayer: null,
    isWaitingForNextPlayer: false,
    nextPlayer: null,
    roundWordsLeft: null,
  },
  // isEnded: false,
  // roundType: ACTING, (string)
  // currentTeam: 7, (id)
  // nextTeam: 9, (id)
  // currentPlayer: 4, (id)
  // isWaitingForNextPlayer: false,
  // nextPlayer: 5, (id)
  // roundWordsLeft: 3,
}

export function reducer(state = init, action) {
  switch (action.type) {
    case ACTION.SAVE_TEAMS:
      return { ...state, teams: action.payload }
    default:
      return state
  }
}

// export function teams(state = init, action) {
//   switch (action.type) {
//     case ACTION.SAVE_TEAMS:
//       return { ...state, teams: action.payload }
//     default:
//       return state.teams
//   }
// }

// export function players(state = init, action) {
//   switch (action.type) {
//     default:
//       return state.players
//   }
// }

// export function game(state = init, action) {
//   switch (action.type) {
//     default:
//       return state.game
//   }
// }
