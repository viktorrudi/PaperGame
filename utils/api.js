import { capitalize } from "./index";
import { DB } from "../constants";
import * as UTIL from "./index";
import * as CONST from "../constants";
import * as CONST_API from "../constants/api";
import firebase from "firebase";

export function getCurrentUserUID() {
  return firebase.auth().currentUser.uid;
}

export function fetchRandomWords(callback) {
  const dataSets = ["things.json", "people.json", "animals.json"];
  Promise.all(
    dataSets.map((url) => fetch(`https://www.randomlists.com/data/${url}`))
  )
    .then((res) => Promise.all(res.map((r) => r.json())))
    .then((data) => {
      callback(
        data.flatMap(({ RandL }) => RandL.items.map((word) => capitalize(word)))
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
  const uid = getCurrentUserUID();
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
    const uid = getCurrentUserUID();

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
  const uid = getCurrentUserUID();
  const lobbiesRef = firebase.database().ref("/lobbies");
  const lobbyKey = lobbiesRef.push().key;
  lobbiesRef.child(lobbyKey).set({
    meta: {
      id: lobbyKey,
      creator: uid,
      displayName: lobbyName,
      status: CONST_API.LOBBY_STATUS.READY,
      createdAt: new Date().getTime(),
    },
    game: {
      // [ uuids ]
      playerQueue: 0,
      // playerQueue index
      activePlayer: 0,
      // [wordIDs]
      activeWordIDs: 0,
      // [wordIDs]
      guessedWords: 0,
      // wordID: { id, word, author }
      availableWords: 0,
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

function getLobbyRefByID(lobbyID) {
  return firebase.database().ref(`/lobbies/${lobbyID}`);
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
  await getLobbyRefByID(lobbyID).remove();
  return true;
}

export async function getLobbyByID(lobbyID) {
  return new Promise((res) => {
    getLobbyRefByID(lobbyID).on("value", (snapshot) => {
      res(snapshot.val());
    });
  });
}

export async function createTeam(lobbyID, team) {
  await getLobbyRefByID(lobbyID).child(`teams/${team.id}`).set(team);
}

export async function createTeams(lobbyID, teams) {
  const teamsDictionary = UTIL.normalizeIDs(teams);
  await getLobbyRefByID(lobbyID).child("teams").push(teamsDictionary);
}

export async function deleteTeam(lobbyID, teamID) {
  await getLobbyRefByID(lobbyID).child(`teams/${teamID}`).remove();
}

export async function updateTeam(lobbyID, team) {
  await getLobbyRefByID(lobbyID).child(`teams/${team.id}`).update(team);
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

/**
 *
 * @param {String} lobbyID
 * @param {Object} words wordID: { ...wordDetails }
 */
export async function saveWords(lobbyID, words) {
  const uid = getCurrentUserUID();
  const snapshot = await getLobbyRefByID(lobbyID)
    .child(`game/availableWords`)
    .once("value");

  const availableWords = Object.values(snapshot.val() || {});
  const hasSavedWords = availableWords.some((w) => w?.author === uid);
  const updatedWords = hasSavedWords
    ? availableWords.reduce((allWords, wordDetails) => {
        const isAuthor = uid === wordDetails.author;
        return {
          ...allWords,
          [wordDetails.id]: {
            ...wordDetails,
            word: isAuthor ? words[wordDetails.id].word : wordDetails.word,
          },
        };
      }, {})
    : words;

  await getLobbyRefByID(lobbyID)
    .child(`game/availableWords`)
    .update(updatedWords);
}

export async function leaveTeam(lobbyID, teamID) {
  const uid = getCurrentUserUID();
  await firebase
    .database()
    .ref(`/lobbies/${lobbyID}/teams/${teamID}/players/${uid}`)
    .remove();
}

/**
 *
 * @param {String} lobbyID
 * @param {Array} wordIDs
 */
export async function clearWordsFromLobby(lobbyID, wordIDs) {
  const cleared = wordIDs.reduce((ids, id) => ({ ...ids, [id]: null }), {});
  await getLobbyRefByID(lobbyID).child("game/availableWords").update(cleared);
}

// TODO
export async function initializeGame(lobby) {
  const playerQueue = UTIL.getOnlinePlayerQueue(lobby.teams);
  const [firstWord] = Object.keys(lobby.game.availableWords);

  const metaData = {
    status: CONST_API.LOBBY_STATUS.PAUSE_ROUND_ONE,
  };
  const gameData = {
    activePlayer: 0,
    activeWordIDs: [firstWord],
    playerQueue,
  };
  await getLobbyRefByID(lobby.meta.id).update({
    meta: { ...lobby.meta, ...metaData },
    game: { ...lobby.game, ...gameData },
  });
}

// Update "meta" props
export async function updateLobbyStatus(lobby, nextStatus) {
  await getLobbyRefByID(lobby.meta.id).child("meta").update({
    status: nextStatus,
  });
}

// Update "game" props
export async function setNextActivePlayer(lobby) {
  const { activePlayer, playerQueue } = lobby.game;
  const possibleNextPlayerIndex = activePlayer + 1;
  const queueIndexes = Object.values(playerQueue).length - 1;
  const nextPlayerIndex =
    possibleNextPlayerIndex > queueIndexes ? 0 : possibleNextPlayerIndex;
  await getLobbyRefByID(lobby.meta.id).child("game").update({
    activePlayer: nextPlayerIndex,
  });
}
