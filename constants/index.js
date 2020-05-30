export const ROUND_TYPE = {
  EXPLAIN: 'EXPLAIN',
  ONE_WORD: 'ONE_WORD',
  MIME: 'MIME',
  display: {
    EXPLAIN: 'Explanation',
    ONE_WORD: 'One Word',
    MIME: 'Miming',
  },
}

export const ROUNDS = [ROUND_TYPE.EXPLAIN, ROUND_TYPE.ONE_WORD, ROUND_TYPE.MIME]

export const ROUTE = {
  MAIN_MENU: 'MAIN_MENU',
  SETUP_TEAM: 'SETUP_TEAM',
  SETUP_WORDS: 'SETUP_WORDS',
  GAME: 'GAME',
  GAME_END: 'GAME_END',
}

export const ACTION = {
  SAVE_TEAMS: 'SAVE_TEAMS',
  SAVE_WORDS: 'SAVE_WORDS',
  RESTART: 'RESTART',
}

export const DEFAULT = {
  TEAM_PROPS: {
    score: 0,
    powerPoints: 5,
  },
  TEAMS: [
    {
      id: 1,
      name: 'Team One',
      members: [
        { id: 1, name: 'Doggo', teamID: 1 },
        { id: 2, name: 'Kocicka', teamID: 1 },
      ],
    },
    {
      id: 2,
      name: 'Team Two',
      members: [
        { id: 3, name: 'Charlie', teamID: 2 },
        { id: 4, name: 'Hollandia', teamID: 2 },
      ],
    },
  ],
}
