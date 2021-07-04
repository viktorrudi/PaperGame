import firebase from "firebase";
import * as API from "./api";
import * as DB_CONST from "../constants/db";

export function FirebaseSeeder() {
  return {
    lobby: () => {
      const lobbyProps = API.getDefaultLobbyProps(
        null,
        "55bvUTYNTjhxqFD6yUvgLgARGp33",
        "Seed lobby"
      );
      lobbyProps.game.availableWords = DB_CONST.AVAILABLE_WORDS;
      lobbyProps.teams = Object.entries(lobbyProps.teams).reduce(
        (teams, [teamID, teamProps], i) => {
          return {
            ...teams,
            [teamID]: {
              ...teamProps,
              players: DB_CONST.PLAYERS[i],
            },
          };
        },
        {}
      );
      console.log(lobbyProps);
      return {
        seed: () => {
          const lobbiesRef = firebase.database().ref("/lobbies");
          const lobbyKey = lobbiesRef.push().key;
          lobbyProps.meta.id = lobbyKey;
          lobbiesRef.child(lobbyKey).set(lobbyProps);
          console.log(`Seeded one lobby`);
        },
      };
    },
  };
}
