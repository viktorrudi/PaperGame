import React, { useEffect } from "react";
import { View, LoaderScreen } from "react-native-ui-lib";
import firebase from "firebase";

import * as CONST from "../constants";

function AuthChecker({ navigation }) {
  useEffect(setAuthListener, []);

  function setAuthListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) navigation.navigate(CONST.ROUTE.MAIN_MENU);
      else navigation.navigate(CONST.ROUTE.LOGIN);
    });
  }

  return (
    <View flex center>
      <LoaderScreen />
    </View>
  );
}

export default AuthChecker;
