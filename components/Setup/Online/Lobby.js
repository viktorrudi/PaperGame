import React, { useState, useEffect } from "react";
import firebase from "firebase";
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

export default function Lobby({ navigation, route }) {
  const { lobbyID } = route.params;
  const [lobby, setLobby] = useState(null);

  useEffect(() => {
    const lobbiesRef = firebase.database().ref(`/lobbies/${lobbyID}`);
    lobbiesRef.on("value", (snapshot) => {
      setLobby(snapshot.val());
    });
  }, [lobbyID]);

  if (!lobby) return <Text>Loading</Text>;
  return (
    <View style={{ margin: 20 }}>
      <Text text60>{lobby.meta.displayName}</Text>
      <View
        marginT-20
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text text50>Teams</Text>
          <Text text80>{Object.keys(lobby.teams || {}).length} / 2</Text>
        </View>
        <Button
          text60
          label="Join Team"
          onPress={() => {
            // navigation.navigate(CONST.ROUTE.LOBBY, {
            //   lobbyID: lobby.meta.id,
            // });
          }}
        />
      </View>

      <View
        marginT-20
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text text50>Players</Text>
          <Text text80>0 / 4</Text>
        </View>
        <Button
          text60
          label="Invite Players"
          onPress={() => {
            // navigation.navigate(CONST.ROUTE.LOBBY, {
            //   lobbyID: lobby.meta.id,
            // });
          }}
        />
      </View>

      <Button
        text60
        marginT-20
        label="Start game"
        onPress={() => {
          // navigation.navigate(CONST.ROUTE.LOBBY, {
          //   lobbyID: lobby.meta.id,
          // });
        }}
      />
    </View>
  );
}
