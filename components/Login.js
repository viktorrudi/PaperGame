import React, { useState, useEffect } from "react";
import { View, Button, TextField, Toast } from "react-native-ui-lib";
import * as CONST from "../constants";
import * as API from "../utils/api";

function Login({ navigation }) {
  const [email, setEmail] = useState("0@test.com");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => setError(null), 2000);
    return () => clearTimeout(timeout);
  }, [error]);

  async function handleSignup() {
    try {
      await API.signUp(email, password);
      navigation.navigate(CONST.ROUTE.MAIN_MENU);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleLogin() {
    try {
      await API.signIn(email, password);
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
        label="Log in"
        onPress={handleLogin}
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

export default Login;
