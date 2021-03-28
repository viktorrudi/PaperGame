import React, { useState, useEffect } from "react";
import _ from "lodash";
import { QRCode } from "react-native-custom-qr-codes-expo";
import { View, Button, Dialog, Text } from "react-native-ui-lib";
import { Share, ScrollView } from "react-native";

import RowAction from "../Shared/RowAction";

import * as API from "../../utils/api";
import * as CONST from "../../constants";
import { useFirebaseListener } from "../../utils/hooks";
import { useBackHandler } from "@react-native-community/hooks";

export default function Lobby({ navigation, route }) {
  const uid = API.getCurrentUserUID();
  const { lobbyID } = route.params;
  const [isShareVisible, setIsShareVisible] = useState(false);
  const {
    data: lobby = {
      game: {},
      meta: {},
      rules: {},
      teams: {},
    },
    isLoading,
    error,
  } = useFirebaseListener(`/lobbies/${lobbyID}`, "lobby");

  // Leave lobby if exiting lobby by using native back functionality
  useBackHandler(async () => {
    await handleLeaveLobby();
    return true;
  });

  useEffect(() => {
    if (error) {
      navigation.navigate(CONST.ROUTE.JOIN_LOBBY, { error });
    }
  }, [error]);

  if (isLoading) return <Text>Loading</Text>;
  if (!lobby || !lobby.game || error)
    return <Text>Sorry, something happened</Text>;

  const teams = Object.values(lobby.teams || {});
  const words = Object.values(lobby.game.availableWords || {});
  const countOf = {
    words: words.length,
    teams: teams.length,
    players: teams.reduce((acc, team) => acc + _.size(team?.players || {}), 0),
  };

  const minWordsToStart = countOf.players * lobby.rules.minWords;
  const isOwner = lobby.meta.creator === uid;
  const usersWords = words.filter((w) => w?.author === uid);
  const inTeam = Object.values(teams).find(
    ({ players = {} }) => uid in players
  );

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

  async function handleLeaveLobby() {
    if (inTeam) await API.leaveTeam(lobbyID, inTeam.id);
    if (usersWords.length > 0) {
      await API.clearWordsFromLobby(
        lobbyID,
        usersWords.map((w) => w.id)
      );
    }
    navigation.navigate(CONST.ROUTE.JOIN_LOBBY);
  }

  return (
    <ScrollView>
      <ShareLobbyDialog
        lobbyID={lobby.meta.id}
        visible={isShareVisible}
        onDismiss={() => setIsShareVisible(false)}
      />
      <View marginT-50 style={{ margin: 20 }}>
        <RowAction
          title={lobby.meta.displayName}
          button={{
            red: true,
            label: "Leave Lobby",
            action: handleLeaveLobby,
          }}
        />
        <RowAction
          title="Teams"
          subtitle={`${countOf.players} player${
            countOf.players.length > 1 ? "s" : ""
          } joined`}
          button={{
            label: "Join a Team",
            action: () => {
              navigation.navigate(CONST.ROUTE.ONLINE_SETUP_TEAM, { lobbyID });
            },
          }}
        />

        {inTeam && (
          <RowAction
            title="Words"
            subtitle={`${countOf.words} added. ${
              minWordsToStart - countOf.words
            } more needed`}
            button={{
              label: `${usersWords.length > 0 ? "Edit" : "Add"} your words`,
              action: () => {
                navigation.navigate(CONST.ROUTE.ONLINE_SETUP_WORDS, {
                  lobbyID,
                });
              },
            }}
          />
        )}

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
            countOf.words < minWordsToStart ||
            countOf.players < CONST.GAME_RULES.PLAYER.MIN ||
            countOf.teams < CONST.GAME_RULES.TEAM.MIN // unlikely to be false
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
    </ScrollView>
  );
}

function ShareLobbyDialog({ visible, onDismiss, lobbyID }) {
  async function share() {
    try {
      const shared = await Share.share({ message: lobbyID });
      if (shared.action === Share.sharedAction) {
        onDismiss();
      }
    } catch (e) {
      console.error("Error sharing", e);
    }
  }

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
        <Button label="Share LobbyID" onPress={share} />
      </View>
    </Dialog>
  );
}
