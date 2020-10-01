import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { TouchableHighlight, Linking } from "react-native";
import { View, Text, Button, Image } from "react-native-ui-lib";

import * as CONST from "../constants";
import githubLogo from "../assets/github-logo.png";

function MainMenu({ navigation, user, dispatch }) {
  return (
    <View flex center>
      <Text text5 blue30 onPress={() => navigation.navigate(CONST.ROUTE.LOGIN)}>
        {user ? user.user.email : "Not signed in :("}
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
          disabled={!user && route === CONST.ROUTE.SETUP_USER}
          marginB-20
          label={label}
          style={{ width: "70%" }}
          onPress={() => navigation.navigate(route)}
        />
      ))}
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
  user: state.user,
});

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(MainMenu);
