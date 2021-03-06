import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Button, TextField, Toast, Text } from "react-native-ui-lib";
import { FlatList } from "react-native";

import * as API from "../../utils/api";
import * as UTIL from "../../utils";
import * as CONST from "../../constants";
import * as CONST_API from "../../constants/api";
import { useHeaderRouting } from "../../utils/hooks";

export default function JoinLobby({ navigation, route }) {
  const [lobbyID, setLobbyID] = useState("");
  const [lobbies, setLobbies] = useState([]);
  const [showError, setShowError] = useState(false);

  useHeaderRouting({
    navigation,
    onBack: () => navigation.navigate(CONST.ROUTE.MAIN_MENU),
  });

  useEffect(() => {
    fillAvailableLobbies();
  }, []);

  useEffect(() => {
    if (route.params?.error?.message) {
      UTIL.toast(route.params?.error?.message);
      fillAvailableLobbies();
    }
  }, [route.params?.error?.message]);

  async function fillAvailableLobbies() {
    try {
      const availableLobbies = (await API.getLobbies()) || {};
      setLobbies(Object.values(availableLobbies).slice(0, 10));
    } catch (e) {
      console.error("IN CREATE LOBBY:", error);
    }
  }

  return (
    <View style={{ margin: 20 }}>
      <Toast
        visible={showError}
        position="top"
        message={route.params?.error?.message || "Oopsies"}
        showDismiss
        onDismiss={() => setShowError(false)}
      />
      <Button
        text60
        label="Join by Lobby QR"
        onPress={() =>
          navigation.navigate(CONST.ROUTE.QR_SCANNER, {
            rerouteTo: CONST.ROUTE.LOBBY,
            qrKey: "lobbyID",
          })
        }
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 20,
        }}
      >
        <View style={{ flexGrow: 1 }}>
          <TextField
            text60
            floatOnFocus
            placeholder="Lobby ID"
            value={lobbyID}
            onChangeText={setLobbyID}
          />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Button
            text60
            disabled={lobbyID.length === 0}
            label="Join by ID"
            onPress={() => navigation.navigate(CONST.ROUTE.LOBBY, { lobbyID })}
          />
        </View>
      </View>

      {/* TODO: Remove before publishing to store */}
      <View marginT-40>
        {lobbies.length === 0 ? (
          <View>
            <Text>No available lobbies</Text>
          </View>
        ) : (
          <>
            <Text>Available Lobbies</Text>
            <FlatList
              data={lobbies}
              keyExtractor={(lobby) => lobby.meta.id}
              renderItem={({ item: lobby }) => {
                return (
                  <View
                    marginT-20
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text text50>{lobby.meta.displayName}</Text>
                      <Text text80>
                        {CONST_API.LOBBY_STATUS_DISPLAY[lobby.meta.status] ||
                          ""}
                      </Text>
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
          </>
        )}
      </View>
    </View>
  );
}
