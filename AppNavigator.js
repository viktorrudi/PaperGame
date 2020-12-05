import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AuthChecker from "./components/AuthChecker";
import Login from "./components/Login";
import MainMenu from "./components/MainMenu";
import GameSettings from "./components/GameSettings";
import TeamSetup from "./components/Setup/TeamSetup";
import WordSetup from "./components/Setup/WordSetup";
import Game from "./components/Game";
import GameEnd from "./components/GameEnd";
import QRScanner from "./components/Shared/QRScanner";

// ONLINE
import UserSetup from "./components/Setup/Online/UserSetup";
import CreateLobby from "./components/Setup/Online/CreateLobby";
import JoinLobby from "./components/Setup/Online/JoinLobby";
import Lobby from "./components/Setup/Online/Lobby";

import * as CONST from "./constants";

const Stack = createStackNavigator();

const headerStyle = {
  headerStyle: {
    backgroundColor: "#000",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
  gestureDirection: "horizontal",
};

const screens = {
  [CONST.ROUTE.AUTH_CHECKER]: {
    Component: AuthChecker,
  },
  [CONST.ROUTE.LOGIN]: {
    Component: Login,
  },
  [CONST.ROUTE.MAIN_MENU]: {
    Component: MainMenu,
  },
  [CONST.ROUTE.GAME]: {
    Component: Game,
  },
  [CONST.ROUTE.GAME_END]: {
    Component: GameEnd,
  },
  [CONST.ROUTE.QR_SCANNER]: {
    Component: QRScanner,
  },
  [CONST.ROUTE.GAME_SETTINGS]: {
    Component: GameSettings,
    options: {
      title: "Settings",
      ...headerStyle,
    },
  },
  [CONST.ROUTE.SETUP_USER]: {
    Component: UserSetup,
    options: {
      title: "Set yourself up",
      ...headerStyle,
    },
  },
  [CONST.ROUTE.CREATE_LOBBY]: {
    Component: CreateLobby,
    options: {
      title: "Create a Lobby",
      ...headerStyle,
    },
  },
  [CONST.ROUTE.JOIN_LOBBY]: {
    Component: JoinLobby,
    options: {
      title: "Join a Lobby",
      ...headerStyle,
    },
  },
  [CONST.ROUTE.LOBBY]: {
    Component: Lobby,
    options: {
      title: "In Lobby",
      ...headerStyle,
    },
  },
  [CONST.ROUTE.SETUP_TEAM]: {
    Component: TeamSetup,
    options: {
      title: "Set up teams",
      ...headerStyle,
    },
  },
  [CONST.ROUTE.SETUP_WORDS]: {
    Component: WordSetup,
    options: {
      title: "Add some words",
      ...headerStyle,
    },
  },
};
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {Object.entries(screens).map(
          ([routeRef, { Component, options = { headerShown: false } }]) => (
            <Stack.Screen
              key={routeRef}
              name={routeRef}
              component={Component}
              options={options}
            />
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
