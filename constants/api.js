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
  PAUSE_ROUND_ONE: "PAUSE_ROUND_ONE",
  PAUSE_ROUND_TWO: "PAUSE_ROUND_TWO",
  PAUSE_ROUND_THREE: "PAUSE_ROUND_THREE",
  ROUND_ONE: "ROUND_ONE",
  ROUND_TWO: "ROUND_TWO",
  ROUND_THREE: "ROUND_THREE",
  PAUSE_NEXT_PLAYER: "PAUSE_NEXT_PLAYER",
  ENDED: "ENDED",
};

export const LOBBY_STATUS_GROUP = {
  IN_GAME: [
    LOBBY_STATUS.PAUSE_ROUND_ONE,
    LOBBY_STATUS.PAUSE_ROUND_TWO,
    LOBBY_STATUS.PAUSE_ROUND_THREE,
    LOBBY_STATUS.ROUND_ONE,
    LOBBY_STATUS.ROUND_TWO,
    LOBBY_STATUS.ROUND_THREE,
    LOBBY_STATUS.PAUSE_NEXT_PLAYER,
  ],
};

export const LOBBY_STATUS_DISPLAY = {
  [LOBBY_STATUS.READY]: "Ready",
  [LOBBY_STATUS.PAUSE_ROUND_ONE]: "In Game",
  [LOBBY_STATUS.PAUSE_ROUND_TWO]: "In Game",
  [LOBBY_STATUS.PAUSE_ROUND_THREE]: "In Game",
  [LOBBY_STATUS.ROUND_ONE]: "In Game",
  [LOBBY_STATUS.ROUND_TWO]: "In Game",
  [LOBBY_STATUS.ROUND_THREE]: "In Game",
  [LOBBY_STATUS.PAUSE_NEXT_PLAYER]: "In Game",
  [LOBBY_STATUS.ENDED]: "Ended",
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
