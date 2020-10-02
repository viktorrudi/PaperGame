import React, { useState, useEffect } from "react";
import firebase from "firebase";

import { TouchableHighlight, Linking } from "react-native";
import { View, Text, Button, Image } from "react-native-ui-lib";

import * as CONST from "../constants";
import * as API from "../utils/api";
import githubLogo from "../assets/github-logo.png";

function MainMenu({ navigation }) {
  const user = firebase.auth().currentUser;
  const isSignedIn = user !== null;

  return (
    <View flex center>
      <Text text5 center blue30>
        {isSignedIn && `Signed in as ${user.email}`}
      </Text>
      <Text text20 blue30>
        Paper Game
      </Text>
      <Text text80 marginB-30 grey40>
        v{CONST.VERSION_NUMBER}
      </Text>
      {CONST.MAIN_MENU_ROUTES.map(({ label, route }) => (
        <Button
          key={route}
          text40
          disabled={!isSignedIn && route === CONST.ROUTE.SETUP_USER}
          marginB-20
          label={label}
          style={{ width: "70%" }}
          onPress={() => navigation.navigate(route)}
        />
      ))}
      <Button
        text70
        size="small"
        label={isSignedIn ? "Log Out" : "Log in"}
        onPress={async () => {
          if (user) await API.signOut();
          navigation.navigate(CONST.ROUTE.LOGIN);
        }}
      />

      <TouchableHighlight
        style={{ position: "absolute", bottom: 10, right: 10 }}
        onPress={() => Linking.openURL(CONST.GITHUB_REPO_URL)}
      >
        <Image
          style={{
            width: 40,
            height: 40,
          }}
          source={githubLogo}
        />
      </TouchableHighlight>
    </View>
  );
}

export default MainMenu;
