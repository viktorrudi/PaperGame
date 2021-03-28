// @refresh reset
import React from "react";
import firebase from "firebase";
import { Provider } from "react-redux";
import { LogBox } from "react-native";
import AppNavigator from "./AppNavigator";

import firebaseConfig from "./config";

import { store } from "./store";

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

// Initialize once
if (firebase && firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
