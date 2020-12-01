import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  TextField,
  ProgressiveImage,
  Text,
} from "react-native-ui-lib";
import { TouchableHighlight, ScrollView, FlatList } from "react-native";

import JoinLobby from "./JoinLobby";

import * as API from "../../../utils/api";
import * as CONST from "../../../constants";

export default function CreateLobby({ navigation }) {
  const [lobbyName, setLobbyName] = useState("");

  async function handleCreateLobby() {
    try {
      await API.createLobby(lobbyName);
      navigation.navigate(CONST.ROUTE.LOBBY);
    } catch (error) {
      console.error("IN CREATE LOBBY:", error);
    }
  }

  return (
    <View style={{ margin: 20 }}>
      <TextField
        text60
        floatOnFocus
        style={{ width: "100%", marginTop: 50 }}
        placeholder="Lobby name"
        value={lobbyName}
        onChangeText={setLobbyName}
      />
      <Button
        text60
        disabled={lobbyName.length === 0}
        label="Create Lobby"
        onPress={handleCreateLobby}
      />
      {/* <Text center marginT-20 text50 blue30>
        Or join one of these lobbies
      </Text> */}
      {/* <Button
        label="Find lobby instead"
        outline
        onPress={() => navigation.navigate(CONST.ROUTE.JOIN_LOBBY)}
      /> */}
      {/* <JoinLobby /> */}
    </View>
  );
}
