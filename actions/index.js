import * as CONST from '../constants'

export function saveTeams(teams) {
  return {
    type: CONST.ACTION.SAVE_TEAMS,
    payload: teams,
  }
}
