import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import { TouchableHighlight, Linking } from "react-native";
import { View, Text, Button, Image } from "react-native-ui-lib";

import { FirebaseSeeder } from "../utils/db";
import * as CONST from "../constants";
import * as API from "../utils/api";
import githubLogo from "../assets/github-logo.png";

function MainMenu({ navigation, isUserAuth, userEmail }) {
  return (
    <View flex center>
      <Text text5 center blue30>
        {isUserAuth && `👻 Signed in with ${userEmail}`}
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
          disabled={!isUserAuth && route === CONST.ROUTE.SETUP_USER}
          marginB-10
          label={label}
          style={{ width: "70%" }}
          onPress={() => navigation.navigate(route)}
        />
      ))}
      <Button
        text70
        size="small"
        label={isUserAuth ? "🚽 Log Out" : "🥰 Log in"}
        onPress={async () => {
          if (isUserAuth) await API.signOut();
          navigation.navigate(CONST.ROUTE.LOGIN);
        }}
      />
      <Button
        text70
        size="small"
        label="SEED"
        onPress={() => {
          FirebaseSeeder().lobby().seed();
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

const mapStateToProps = (state) => ({
  isUserAuth: state.user.isAuth,
  userEmail: state.user.email,
});

export default connect(mapStateToProps)(MainMenu);
