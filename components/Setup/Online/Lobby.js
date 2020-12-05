import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { QRCode } from "react-native-custom-qr-codes-expo";
import {
  View,
  Button,
  Dialog,
  TextField,
  ProgressiveImage,
  Text,
} from "react-native-ui-lib";
import { TouchableHighlight, ScrollView, FlatList, Share } from "react-native";

import * as API from "../../../utils/api";
import * as CONST from "../../../constants";
import { useFirebaseListener } from "../../../utils/hooks";

const REQUIRED = {
  TEAM: {
    COUNT: 2,
  },
  PLAYER: {
    COUNT: 4,
  },
};

export default function Lobby({ navigation, route }) {
  const [isShareVisible, setIsShareVisible] = useState(false);
  console.log({ route: `/lobbies/${route.params.lobbyID}` });
  const { data: lobby, isLoading, error } = useFirebaseListener(
    `/lobbies/${route.params.lobbyID}`,
    "lobby"
  );

  useEffect(() => {
    if (error) navigation.navigate(CONST.ROUTE.JOIN_LOBBY, { error });
  }, [error]);

  if (isLoading) return <Text>Loading</Text>;
  if (!lobby || error) return <Text>Sorry, something happened</Text>;

  const countOf = {
    players: Object.keys(lobby.players || {}).length,
    teams: Object.keys(lobby.teams || {}).length,
  };

  return (
    <>
      <ShareLobbyDialog
        lobbyID={lobby.meta.id}
        visible={isShareVisible}
        onDismiss={() => setIsShareVisible(false)}
      />
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
            <Text text80>
              {countOf.teams} / {REQUIRED.TEAM.COUNT}
            </Text>
          </View>
          <Button
            text60
            label="Join a Team"
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
            <Text text80>
              {countOf.players} / {REQUIRED.PLAYER.COUNT}
            </Text>
          </View>
        </View>

        <Button
          marginT-50
          outline
          text60
          label="Invite Players"
          onPress={() => setIsShareVisible(true)}
        />
        <Button
          text40
          marginT-20
          disabled={
            countOf.players < REQUIRED.PLAYER.COUNT ||
            countOf.teams < REQUIRED.TEAM.COUNT
          }
          label="Start game"
          onPress={() => {
            // navigation.navigate(CONST.ROUTE.ONLINE_GAME, {
            //   lobbyID: lobby.meta.id,
            // });
          }}
        />
      </View>
    </>
  );
}

function ShareLobbyDialog({ visible, onDismiss, lobbyID }) {
  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <View
        style={{
          backgroundColor: "white",
          padding: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text center marginB-20>
          Scan or Share the lobby ID
        </Text>
        <QRCode content={lobbyID} />
        <Button
          label="Share LobbyID"
          onPress={async () => {
            try {
              const shared = await Share.share({ message: lobbyID });
              if (shared.action === Share.sharedAction) {
                onDismiss();
              }
            } catch (e) {
              console.error("Error sharing", e);
            }
          }}
        />
      </View>
    </Dialog>
  );
}
