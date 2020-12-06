import { capitalize } from "./index";
import { DB, DB_TYPE, USER_PROPS } from "../constants";
import * as UTIL from "./index";
import * as CONST from "../constants";
import firebase from "firebase";

export function getCurrentUserUID() {
  return firebase.auth().currentUser.uid;
}

export function fetchRandomPeople(callback) {
  const dataSets = ["things.json", "people.json", "animals.json"];
  Promise.all(
    dataSets.map((url) => fetch(`https://www.randomlists.com/data/${url}`))
  )
    .then((res) => Promise.all(res.map((r) => r.json())))
    .then((data) => {
      callback(
        data.flatMap(({ RandL }) =>
          RandL.items.map((word) => {
            return capitalize(word);
          })
        )
      );
    });
}

export function uploadImage(userID, imageBlob) {
  if (!userID || !imageBlob)
    throw new Error("Missing userID or imageBlob in uploadImage() call");
  const storage = firebase.storage().ref();
  return storage.child(`${DB.USER_IMAGES}/${userID}`).put(imageBlob);
}

export async function signIn(email, password) {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (e) {
    alert(e.message);
  }
}

export async function signUp(email, password) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const { uid } = firebase.auth().currentUser;

    const userDetails = {
      username: email.split("@")[0],
      uid,
      email,
      imageURL: "",
    };

    firebase
      .database()
      .ref()
      .update({ [`/users/${uid}`]: userDetails });
  } catch (e) {
    alert(e.message);
  }
}

export async function getCurrentUser() {
  const uid = firebase.auth().currentUser.uid;
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(`users/${uid}`)
      .once("value", (snapshot) => {
        resolve(snapshot.val());
      });
  });
}

export async function updateCurrentUser(props) {
  try {
    const uid = firebase.auth().currentUser.uid;

    await firebase
      .database()
      .ref()
      .update({ [`/users/${uid}`]: props });
  } catch (e) {
    alert(e.message);
  }
}

export async function signOut() {
  try {
    await firebase.auth().signOut();
  } catch (e) {
    alert(e.message);
  }
}

export async function getUserByUID(uid) {
  try {
    const usersRef = firebase.database().ref(`/users/${uid}`);
    return new Promise((res) => {
      usersRef.once("value", (snapshot) => {
        res(snapshot.val());
      });
    });
  } catch (e) {
    console.error("GET USER BY ID ERROR", e);
  }
}

export async function createLobby(lobbyName) {
  const uid = firebase.auth().currentUser.uid;
  const lobbiesRef = firebase.database().ref("/lobbies");
  const lobbyKey = lobbiesRef.push().key;
  lobbiesRef.child(lobbyKey).set({
    meta: {
      id: lobbyKey,
      creator: uid,
      displayName: lobbyName,
      status: "ready",
      createdAt: new Date().getTime(),
    },
    game: {
      activePlayer: 0, // uid
      activeTeam: 0, // teamID
      round: 0,
      // { id, word, author }
      guessedWords: [],
      // { id, word, author }
      availableWords: [],
    },
    rules: {
      roundTimer: "30",
      minWords: "3",
    },
    // teamID: { id, displayName, score, powerPoints, players[uid] }
    teams: {
      1337: CONST.DEFAULT_DB_PROPS.TEAM(1337),
      420: CONST.DEFAULT_DB_PROPS.TEAM(420),
    },
  });
  return lobbyKey;
}

export async function getLobbies() {
  const lobbiesRef = firebase.database().ref("/lobbies");
  return new Promise((res) => {
    lobbiesRef.once("value", (snapshot) => {
      res(snapshot.val());
    });
  });
}

export async function deleteLobby(lobbyID) {
  const lobbiesRef = firebase.database().ref(`/lobbies/${lobbyID}`);
  await lobbiesRef.remove();
  return true;
}

export async function getLobbyByID(lobbyID) {
  const lobbiesRef = firebase.database().ref(`/lobbies/${lobbyID}`);
  return new Promise((res) => {
    lobbiesRef.on("value", (snapshot) => {
      res(snapshot.val());
    });
  });
}

export async function createTeam(lobbyID, team) {
  const lobbiesRef = firebase.database().ref(`/lobbies/${lobbyID}`);
  await lobbiesRef.child(`teams/${team.id}`).set(team);
}

export async function createTeams(lobbyID, teams) {
  const teamsDictionary = UTIL.normalizeIDs(teams);
  const lobbiesRef = firebase.database().ref(`/lobbies/${lobbyID}`);
  await lobbiesRef.child("teams").push(teamsDictionary);
}

export async function deleteTeam(lobbyID, teamID) {
  const lobbiesRef = firebase.database().ref(`/lobbies/${lobbyID}`);
  await lobbiesRef.child(`teams/${teamID}`).remove();
}

export async function updateTeam(lobbyID, team) {
  const lobbiesRef = firebase.database().ref(`/lobbies/${lobbyID}`);
  await lobbiesRef.child(`teams/${team.id}`).update(team);
}

export async function joinTeam(lobbyID, teamID) {
  const uid = getCurrentUserUID();
  const teamsRef = await firebase.database().ref(`/lobbies/${lobbyID}/teams`);

  teamsRef.once("value", async (snapshot) => {
    const currentTeams = snapshot.val();
    const prevTeam = Object.values(currentTeams).reduce((pTeam, team) => {
      if (pTeam) return pTeam;
      if (uid in (team.players || {})) {
        return team;
      }
    }, null);

    if (prevTeam) {
      await leaveTeam(lobbyID, prevTeam.id);
    }
  });

  const user = await getUserByUID(uid);
  await teamsRef.child(`${teamID}/players/${uid}`).set(user);
}

export async function leaveTeam(lobbyID, teamID) {
  const uid = getCurrentUserUID();
  await firebase
    .database()
    .ref(`/lobbies/${lobbyID}/teams/${teamID}/players/${uid}`)
    .remove();
}
