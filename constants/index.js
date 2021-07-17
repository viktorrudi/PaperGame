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
  ONLINE_GAME_END: "ONLINE_GAME_END",
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
  "404! Group name does not exist",
  "A Team with No Name",
  "Abusement Park",
  "Alcoholism Is The Real Winner",
  "All Pain, No Gain",
  "Are We There Yet?",
  "Ask Me How I Made $20 Today",
  "Bacon Water",
  "Bad Hair Day",
  "Bed Bath and Beyoncé",
  "Beer Makes Smart",
  "Benchwarmers",
  "Brain drain",
  "Can We Use A Lifeline?",
  "Canada: America’s Hat",
  "Cereal Killers",
  "Chunky Monkeys",
  "Corporate Punishment",
  "Couch Potatoes",
  "Cubicle Force",
  "Daddy Issues",
  "Donald Trump’s Barber Shop",
  "Dyslexia United",
  "Easier Said Than Run",
  "Every day I’m Calculatin’",
  "Evil League of Evil",
  "Free Wi-Fi",
  "Game of Drones",
  "Goal diggers",
  "Google",
  "Hairy Backs Anonymous",
  "Hole In None",
  "Housebroken",
  "I Can’t Read This",
  "I’m Too Trivia to Drunk",
  "In First Place with 100 Points",
  "In It For The Beer",
  "It’s Only Cannibalism If You Swallow",
  "Livin’ On A Spare",
  "Man-Chest-Hair United",
  "Menace II Sobriety",
  "Mmmm Pie",
  "Mostly Harmless",
  "Mullet Mafia",
  "Nerd Herd",
  "Nerdlings",
  "No Regrets",
  "Not Fast, Just Furious",
  "Not Last Place",
  "Only Here to Establish an Alibi",
  "Outside the Asylum",
  "Periodic Farters",
  "Pigs Can Fly",
  "Prawn Stars",
  "Procrastinators",
  "Punny",
  "Recycle Bin",
  "Run Like the Winded",
  "Sausage Factory",
  "Say That Again",
  "Scrambled Legs",
  "Should Have Paid More Attention In School",
  "Show Me The Monet",
  "Smells Like Team Spirit",
  "Sons of Pitches",
  "Southern Discomfort",
  "Spaghetti Legs",
  "Spicy Mustard",
  "Stable Geniuses",
  "Still Trying To Decide",
  "Stinky Cheese",
  "Straight off the couch",
  "Superheroes in Training",
  "Team Not Appearing in This Competition",
  "Tequila Mockingbird",
  "That’s Not a Knife",
  "The Dorks",
  "The Internet",
  "The IT Crowd",
  "The Knights Who Say Ni",
  "The London Silly Nannies",
  "The Meme Team",
  "The Mighty Morphin Power Rangers",
  "The Mystery Machine",
  "The Other Team",
  "The Smartest Guys in The Room",
  "The Team Team",
  "The World’s Tallest Midgets",
  "TPS Reporters",
  "Victorious Secret",
  "Village Idiots",
  "We Showed Up",
  "We Who Shall Not Be Named",
  "What’s In a Name?",
  "Who In This Room Farted?",
  "Why Did The Koala Fall Out The Tree? It Died",
  "Win or Lose, We Booze",
  "With Great Mustaches Comes Great Responsibility",
  "Worse Than Nickleback",
  "You’re A Wizard, Harry",
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
