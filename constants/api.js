import { SaveFormat } from "expo-image-manipulator";
import { MediaTypeOptions } from "expo-image-picker";

export const DB = {
  // In Firebase Database
  USER_DETAILS: "user_details",
  // In Firebase Storage
  USER_IMAGES: "user_images",
};

export const DB_TYPE = {
  STORAGE: "STORAGE",
  REALTIME: "REALTIME",
};

export const LOBBY_STATUS = {
  READY: "READY",
  IN_ROUND: "IN_ROUND",
  ROUND_EXPLANATION: "ROUND_EXPLANATION",
  PLAYER_ANNOUNCEMENT: "PLAYER_ANNOUNCEMENT",
  GAME_OVER: "GAME_OVER",
};

export const LOBBY_STATUS_GROUP = {
  IN_GAME: [
    LOBBY_STATUS.IN_ROUND,
    LOBBY_STATUS.PLAYER_ANNOUNCEMENT,
    LOBBY_STATUS.ROUND_EXPLANATION,
    LOBBY_STATUS.GAME_OVER,
  ],
};

export const LOBBY_STATUS_DISPLAY = {
  [LOBBY_STATUS.READY]: "Ready",
  [LOBBY_STATUS.IN_ROUND]: "Playing",
  [LOBBY_STATUS.ROUND_EXPLANATION]: "Playing",
  [LOBBY_STATUS.PLAYER_ANNOUNCEMENT]: "Waiting for player",
  [LOBBY_STATUS.GAME_OVER]: "Game ending",
};

export const IMAGE = {
  // Used with ImagePicker
  OPTIONS: {
    quality: 0.5,
    allowsEditing: true,
    aspect: [1, 1],
    mediaTypes: MediaTypeOptions.Images,
  },
  // Used with ImageManipulator
  CONSTRAINTS: {
    SIZE: {
      resize: {
        width: 500,
        height: 500,
      },
    },
    FORMAT: { compress: 0.5, format: SaveFormat.PNG },
  },
};
