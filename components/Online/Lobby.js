import React, { useState, useEffect } from "react";
import _ from "lodash";
import { QRCode } from "react-native-custom-qr-codes-expo";
import { View, Button, Dialog, Text } from "react-native-ui-lib";
import { Share } from "react-native";

import * as API from "../../utils/api";
import * as CONST from "../../constants";
import { useFirebaseListener } from "../../utils/hooks";

export default function Lobby({ navigation, route }) {
  const [isShareVisible, setIsShareVisible] = useState(false);

  const { data: lobby, isLoading, error } = useFirebaseListener(
    `/lobbies/${route.params.lobbyID}`,
    "lobby"
  );

  useEffect(() => {
    if (error) {
      navigation.navigate(CONST.ROUTE.JOIN_LOBBY, { error });
    }
  }, [error]);

  if (isLoading) return <Text>Loading</Text>;
  if (!lobby || error) return <Text>Sorry, something happened</Text>;

  const isOwner = lobby.meta.creator === API.getCurrentUserUID();
  const countOf = {
    teams: Object.keys(lobby.teams).length,
    players: Object.values(lobby.teams).reduce(
      (acc, team) => acc + _.size(team?.players || {}),
      0
    ),
  };

  async function closeLobby() {
    try {
      await API.deleteLobby(lobby.meta.id);
      navigation.navigate(CONST.ROUTE.JOIN_LOBBY, { error: null });
    } catch (e) {
      navigation.navigate(CONST.ROUTE.JOIN_LOBBY, {
        error: { message: "Unable to delete lobby" },
      });
    }
  }

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
              {countOf.teams} / {CONST.GAME_RULES.TEAM.MIN}
            </Text>
          </View>
          <Button
            text60
            label="Join a Team"
            onPress={() => {
              navigation.navigate(CONST.ROUTE.ONLINE_SETUP_TEAM, {
                lobbyID: lobby.meta.id,
              });
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
              {countOf.players} / {CONST.GAME_RULES.PLAYER.MIN}
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
            countOf.players < CONST.GAME_RULES.PLAYER.MIN ||
            countOf.teams < CONST.GAME_RULES.TEAM.MIN
          }
          label="Start game"
          onPress={() => {
            // navigation.navigate(CONST.ROUTE.ONLINE_GAME, {
            //   lobbyID: lobby.meta.id,
            // });
          }}
        />
        {isOwner && (
          <Button
            text40
            bg-red30
            marginT-20
            label="Close Lobby"
            onPress={closeLobby}
          />
        )}
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
