import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  TextField,
  ProgressiveImage,
  Text,
} from "react-native-ui-lib";
import { TouchableHighlight, ScrollView, FlatList } from "react-native";

import * as API from "../../../utils/api";
import * as CONST from "../../../constants";

export default function JoinLobby({ navigation }) {
  const [lobbyID, setLobbyID] = useState("");
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    fillAvailableLobbies();
  }, []);

  async function fillAvailableLobbies() {
    try {
      const availableLobbies = (await API.getLobbies()) || {};
      const parsedLobbies = Object.entries(availableLobbies).map(
        ([lobbyKey, lobby]) => {
          // const { status, displayName, creator } = lobby;
          return {
            lobbyKey,
            ...lobby,
          };
        }
      );
      setLobbies(parsedLobbies);
    } catch (e) {
      console.error("IN CREATE LOBBY:", error);
    }
  }

  return (
    <View style={{ margin: 20 }}>
      <Text center marginT-20 text50 blue30>
        Join by lobby ID
      </Text>
      <TextField
        text60
        floatOnFocus
        style={{ width: "100%" }}
        placeholder="Lobby ID"
        value={lobbyID}
        onChangeText={setLobbyID}
      />
      <Button
        text60
        outline={lobbyID.length === 0}
        label="Join by ID"
        onPress={() => navigation.navigate(CONST.ROUTE.LOBBY)}
      />
      <View marginT-40>
        <Text>Available Lobbies</Text>
        <FlatList
          data={lobbies}
          renderItem={({ item: lobby }) => {
            return (
              <View
                marginT-20
                key={lobby.lobbyKey}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text text50>{lobby.displayName}</Text>
                  <Text text80>{lobby.status}</Text>
                </View>
                <Button
                  text60
                  outline={lobbyID.length > 0}
                  label="Join"
                  onPress={() => navigation.navigate(CONST.ROUTE.LOBBY, lobby)}
                />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
