import { ACTION, ROUNDS } from "../constants";

const init = {
  gameSettings: {
    roundTimer: 30,
    powerPointsPerRound: 5,
    minWords: 3,
  },
  userInputs: [],
  teams: [],
  user: {
    isAuth: false,
    uid: null,
    email: null,
  },
};

export function reducer(state = init, action) {
  switch (action.type) {
    case "USER_AUTH":
      return {
        ...state,
        user: {
          isAuth: action.payload.isAuth,
          uid: action.payload.uid,
          email: action.payload.email,
          imageURL: action.payload.imageURL,
        },
      };
    case ACTION.RESTART:
      return { ...state, userInputs: init.userInputs, teams: init.userInputs };
    case ACTION.UPDATE_GAME_SETTINGS:
      return {
        ...state,
        gameSettings: { ...state.gameSettings, ...action.payload },
      };
    case ACTION.SAVE_TEAMS:
      return { ...state, teams: action.payload };
    case ACTION.SAVE_WORDS:
      return {
        ...state,
        userInputs: [...state.userInputs, ...action.payload],
      };
    default:
      return state;
  }
}
