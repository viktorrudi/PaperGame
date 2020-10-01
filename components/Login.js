import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { connect } from "react-redux";
import { View, Button, TextField, Toast } from "react-native-ui-lib";
import * as CONST from "../constants";

function Login({ navigation, dispatch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => setError(null), 2000);
    return () => clearTimeout(timeout);
  }, [error]);

  async function handleSignup() {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleSignin() {
    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      dispatch({
        type: CONST.ACTION.LOGIN,
        payload: user,
      });
      navigation.navigate(CONST.ROUTE.MAIN_MENU);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <View paddingH-20 flex center>
      <Toast
        visible={Boolean(error)}
        position="bottom"
        message={error}
        showDismiss
        onDismiss={() => setError(null)}
      />
      <TextField
        placeholder="Email"
        text60
        value={email}
        floatOnFocus
        style={{ width: "100%" }}
        onChangeText={setEmail}
      />
      <TextField
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        text60
        floatOnFocus
        style={{ width: "100%" }}
      />
      <Button
        style={{ width: "100%" }}
        marginB-10
        label="Sign in"
        onPress={handleSignin}
      />

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <Button marginR-10 label="Sign up" onPress={handleSignup} />
        <Button
          label="Play offline"
          outline
          onPress={() => navigation.navigate(CONST.ROUTE.MAIN_MENU)}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(Login);
