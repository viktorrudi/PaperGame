import * as UTIL from "../utils";

export const PLAYERS = [
  {
    "55bvUTYNTjhxqFD6yUvgLgARGp33": {
      username: "test 0",
      imageURL: "",
      uid: "55bvUTYNTjhxqFD6yUvgLgARGp33",
    },
    MQHsBvJJT0cAHOA11H2YxZgITB32: {
      username: "test 1",
      imageURL: "",
      uid: "MQHsBvJJT0cAHOA11H2YxZgITB32",
    },
  },
  {
    DANgbBMjXVVT9S49C9g2e5XEfJ93: {
      username: "test 2",
      imageURL: "",
      uid: "DANgbBMjXVVT9S49C9g2e5XEfJ93",
    },
    s90AwonEY8gPYnkJIN1SV6bBbOv1: {
      username: "test 3",
      imageURL: "",
      uid: "DANgbBMjXVVT9S49C9g2e5XEfJ93",
    },
  },
];

export const AVAILABLE_WORDS = Object.values({
  ...PLAYERS[0],
  ...PLAYERS[1],
}).reduce((availableWords, player, i) => {
  const randomID = UTIL.getRandomID();
  return {
    ...availableWords,
    [randomID]: {
      id: randomID,
      word: `Word ${randomID}`,
      author: player.uid,
    },
    [randomID + 1]: {
      id: randomID + 1,
      word: `Word ${randomID + 1}`,
      author: player.uid,
    },
    [randomID + 2]: {
      id: randomID + 2,
      word: `Word ${randomID + 2}`,
      author: player.uid,
    },
  };
}, {});
