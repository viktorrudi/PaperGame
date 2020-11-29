import { capitalize } from "./index";
import { DB, DB_TYPE, USER_PROPS } from "../constants";
import firebase from "firebase";

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
  lobbiesRef.push({
    creator: uid,
    displayName: lobbyName,
    status: "ready",
  });
}

export async function getLobbies() {
  const lobbiesRef = firebase.database().ref("/lobbies");
  return new Promise((res) => {
    lobbiesRef.once("value", (snapshot) => {
      res(snapshot.val());
    });
  });
}
