import React, { useEffect } from "react";
import { connect } from "react-redux";
import { View, LoaderScreen } from "react-native-ui-lib";
import firebase from "firebase";

import * as CONST from "../constants";

function AuthChecker({ navigation, dispatch }) {
  useEffect(setAuthListener, []);

  function setAuthListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: "USER_AUTH",
          payload: { isAuth: true, uid: user.uid, email: user.email },
        });
        navigation.navigate(CONST.ROUTE.MAIN_MENU);
      } else {
        dispatch({
          type: "USER_AUTH",
          payload: { isAuth: false, uid: null, email: null },
        });
        navigation.navigate(CONST.ROUTE.LOGIN);
      }
    });
  }

  return (
    <View flex center>
      <LoaderScreen />
    </View>
  );
}

export default connect(null, (dispatch) => ({ dispatch }))(AuthChecker);
