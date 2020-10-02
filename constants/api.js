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
