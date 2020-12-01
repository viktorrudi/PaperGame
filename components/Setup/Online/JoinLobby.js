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
      console.log(availableLobbies);
      setLobbies(Object.values(availableLobbies));
    } catch (e) {
      console.error("IN CREATE LOBBY:", error);
    }
  }

  return (
    <View style={{ margin: 20 }}>
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
                key={lobby.meta.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text text50>{lobby.meta.displayName}</Text>
                  <Text text80>{lobby.meta.status}</Text>
                </View>
                <Button
                  text60
                  outline={lobbyID.length > 0}
                  label="Join"
                  onPress={() =>
                    navigation.navigate(CONST.ROUTE.LOBBY, {
                      lobbyID: lobby.meta.id,
                    })
                  }
                />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
