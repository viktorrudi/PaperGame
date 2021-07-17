import React, { useState } from "react";
import { View, Button, TextField } from "react-native-ui-lib";

import * as API from "../../utils/api";
import * as CONST from "../../constants";

export default function CreateLobby({ navigation }) {
  const [lobbyName, setLobbyName] = useState("");

  async function handleCreateLobby() {
    try {
      const lobbyID = await API.createLobby(lobbyName);
      navigation.navigate(CONST.ROUTE.LOBBY, { lobbyID });
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
    </View>
  );
}
