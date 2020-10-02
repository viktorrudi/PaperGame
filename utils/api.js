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

export function db(ref, type, child) {
  if (!type) return firebase.database().ref(ref);
  switch (type) {
    case DB_TYPE.STORAGE:
      const storage = firebase.storage().ref(ref);
      return child ? storage.child(child) : storage;

    default:
      throw Error("Invalid type");
  }
}

export async function signIn(email, password) {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
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

export async function signUp(email, password) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
  } catch (e) {
    alert(e.message);
  }
}

export async function updateCurrentUser(props) {
  try {
    await firebase.auth().currentUser.updateProfile(props);
  } catch (e) {
    alert(e.message);
  }
}
