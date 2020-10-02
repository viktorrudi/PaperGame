export const VERSION_NUMBER = "0.0.2";
export const GITHUB_REPO_URL = "https://github.com/viktorrudi/PaperGame";

export const ROUND_TYPE = {
  EXPLAIN: "EXPLAIN",
  ONE_WORD: "ONE_WORD",
  MIME: "MIME",
  display: {
    EXPLAIN: "Explanation",
    ONE_WORD: "One Word",
    MIME: "Miming",
  },
};

export const ROUND_TYPE_HINT = {
  EXPLAIN:
    "You can fully explain the word, except for using the word or something which rhymes with it.",
  ONE_WORD: "You can only use one word to explain your given word.",
  MIME: "No talking! You must use your body to explain the given word.",
};

export const ROUNDS = [
  ROUND_TYPE.EXPLAIN,
  ROUND_TYPE.ONE_WORD,
  ROUND_TYPE.MIME,
];

export const ROUTE = {
  AUTH_CHECKER: "AUTH_CHECKER",
  LOGIN: "LOGIN",
  MAIN_MENU: "MAIN_MENU",
  GAME_SETTINGS: "GAME_SETTINGS",
  SETUP_USER: "SETUP_USER",
  SETUP_TEAM: "SETUP_TEAM",
  SETUP_WORDS: "SETUP_WORDS",
  GAME_END: "GAME_END",
  GAME: "GAME",
};

export const MAIN_MENU_ROUTES = [
  {
    label: "🌍 Online Game",
    route: ROUTE.SETUP_USER,
  },
  {
    label: "🏠 Offline Game",
    route: ROUTE.SETUP_TEAM,
  },
  {
    label: "🤔 Settings",
    route: ROUTE.GAME_SETTINGS,
  },
];

export const ACTION = {
  UPDATE_GAME_SETTINGS: "UPDATE_GAME_SETTINGS",
  SAVE_TEAMS: "SAVE_TEAMS",
  SAVE_WORDS: "SAVE_WORDS",
  RESTART: "RESTART",
};

export const DEFAULT = {
  TEAM_PROPS: {
    score: 0,
    powerPoints: 5,
  },
  TEAMS: [
    {
      id: 1,
      name: "Team One",
      members: [
        { id: 1, name: "Doggo", teamID: 1 },
        { id: 2, name: "Kocicka", teamID: 1 },
      ],
    },
    {
      id: 2,
      name: "Team Two",
      members: [
        { id: 3, name: "Charlie", teamID: 2 },
        { id: 4, name: "Hollandia", teamID: 2 },
      ],
    },
  ],
};

export * from "./api";
