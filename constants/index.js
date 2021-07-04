export const VERSION_NUMBER = "0.0.2";
export const GITHUB_REPO_URL = "https://github.com/viktorrudi/PaperGame";

// ONLINE / OFFLINE
export const ROUTE = {
  AUTH_CHECKER: "AUTH_CHECKER",
  QR_SCANNER: "QR_SCANNER",
  LOGIN: "LOGIN",
  MAIN_MENU: "MAIN_MENU",
  GAME_SETTINGS: "GAME_SETTINGS",
  SETUP_USER: "SETUP_USER",
  CREATE_LOBBY: "CREATE_LOBBY",
  JOIN_LOBBY: "JOIN_LOBBY",
  LOBBY: "LOBBY",
  OFFLINE_SETUP_TEAM: "OFFLINE_SETUP_TEAM",
  ONLINE_SETUP_TEAM: "ONLINE_SETUP_TEAM",
  ONLINE_SETUP_WORDS: "ONLINE_SETUP_WORDS",
  SETUP_WORDS: "SETUP_WORDS",
  GAME_END: "GAME_END",
  GAME: "GAME",
  ONLINE_GAME: "ONLINE_GAME",
};

// ONLINE / OFFLINE
export const MAIN_MENU_ROUTES = [
  {
    label: "🌍 Online Game",
    route: ROUTE.SETUP_USER,
  },
  {
    label: "🏠 Offline Game",
    route: ROUTE.OFFLINE_SETUP_TEAM,
  },
  {
    label: "🤔 Settings",
    route: ROUTE.GAME_SETTINGS,
  },
];

// ONLINE / OFFLINE
export const GAME_RULES = {
  TEAM: {
    MIN: 2,
  },
  PLAYER: {
    MIN: 4,
  },
};

// ONLINE // OFFLINE
export const ROUND_TYPE_HINT = {
  EXPLAIN:
    "You can fully explain the word, except for using the word or something which rhymes with it.",
  ONE_WORD: "You can only use one word to explain your given word.",
  MIME: "No talking! You must use your body to explain the given word.",
};

// ONLINE / OFFLINE
export const ROUND_TYPE = {
  EXPLAIN: "EXPLAIN",
  ONE_WORD: "ONE_WORD",
  MIME: "MIME",
  // Offline
  display: {
    EXPLAIN: "Explanation",
    ONE_WORD: "One Word",
    MIME: "Miming",
  },
};

// ONLINE
export const ROUND_DETAILS = {
  [ROUND_TYPE.EXPLAIN]: {
    TITLE: "Explanation",
    HINT: ROUND_TYPE_HINT.EXPLAIN,
  },
  [ROUND_TYPE.ONE_WORD]: {
    TITLE: "One Word",
    HINT: ROUND_TYPE_HINT.ONE_WORD,
  },
  [ROUND_TYPE.MIME]: {
    TITLE: "Miming",
    HINT: ROUND_TYPE_HINT.MIME,
  },
};

// ONLINE
export const ROUND_DETAILS_BY_ORDER = [
  ROUND_DETAILS.EXPLAIN,
  ROUND_DETAILS.ONE_WORD,
  ROUND_DETAILS.MIME,
];

// ONLINE
export const RANDOM_TEAM_NAMES = [
  "Team a",
  "Team b",
  "Team c",
  "Team d",
  "Team e",
];

// OFFLINE
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

// OFFLINE
export const ROUNDS = [
  ROUND_TYPE.EXPLAIN,
  ROUND_TYPE.ONE_WORD,
  ROUND_TYPE.MIME,
];

// OFFLINE
export const ACTION = {
  UPDATE_GAME_SETTINGS: "UPDATE_GAME_SETTINGS",
  SAVE_TEAMS: "SAVE_TEAMS",
  SAVE_WORDS: "SAVE_WORDS",
  RESTART: "RESTART",
};

export * from "./api";
