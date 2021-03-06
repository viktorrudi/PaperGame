import React, { useState, useEffect } from "react";
import _ from "lodash";
import { QRCode } from "react-native-custom-qr-codes-expo";
import { View, Button, Dialog, Text } from "react-native-ui-lib";
import { Share, ScrollView } from "react-native";

import RowAction from "../Shared/RowAction";
import FullScreenLoader from "../FullScreenLoader";

import * as UTIL from "../../utils";
import * as API from "../../utils/api";
import * as CONST from "../../constants";
import * as CONST_API from "../../constants/api";
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

  const roundTimer = parseInt(lobby?.rules?.roundTimer || "30");

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

  // useEffect(redirectIfInGame, [lobby.meta?.status, lobby.meta?.id]);

  if (isLoading) return <FullScreenLoader />;
  if (!lobby || !lobby.game || error) {
    console.error("Something happened", lobby, error);
    return (
      <Text>
        Sorry, something happened. Please try going back to restarting the app.
      </Text>
    );
  }

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
      navigation.navigate(CONST.ROUTE.JOIN_LOBBY, { error: null });
      await API.deleteLobby(lobby.meta.id);
      UTIL.toast("Lobby closed");
    } catch (e) {
      console.error("Unable to close lobby", e);
      UTIL.toast("Unable to close lobby");
      navigation.navigate(CONST.ROUTE.JOIN_LOBBY, {
        error: { message: "Unable to close lobby" },
      });
    }
  }

  async function handleLeaveLobby() {
    if (!isLobbyInGame()) {
      if (inTeam) {
        await API.leaveTeam(lobbyID, inTeam.id);
      }
      if (usersWords?.length > 0) {
        await API.clearWordsFromLobby(
          lobbyID,
          usersWords.map((w) => w.id)
        );
      }
    }
    navigation.navigate(CONST.ROUTE.JOIN_LOBBY, { error: null });
  }

  async function handleStartGame() {
    await API.initializeGame(lobby);
    goToGame();
  }

  function isLobbyInGame() {
    return CONST_API.LOBBY_STATUS_GROUP.IN_GAME.includes(lobby.meta?.status);
  }

  // function redirectIfInGame() {
  //   if (isLobbyInGame()) goToGame();
  // }

  function goToGame() {
    navigation.navigate(CONST.ROUTE.ONLINE_GAME, {
      lobbyID: lobby.meta.id,
    });
  }

  return (
    <ScrollView>
      <ShareLobbyDialog
        lobbyID={lobby.meta.id}
        visible={isShareVisible}
        onDismiss={() => setIsShareVisible(false)}
      />
      <View marginT-50 style={{ margin: 20 }}>
        {isLobbyInGame() ? (
          <View>
            <Text center text40 marginB-20>
              A game is in progress
            </Text>
            <RowAction
              title={lobby.meta.displayName}
              subtitle={CONST_API.LOBBY_STATUS_DISPLAY[lobby.meta.status]}
              button={{
                label: "Re-join",
                action: goToGame,
              }}
            />
          </View>
        ) : (
          <RowAction
            title={lobby.meta.displayName}
            button={{
              red: true,
              label: "Leave Lobby",
              action: handleLeaveLobby,
            }}
          />
        )}
        <RowAction
          title="Teams"
          subtitle={`${countOf.players} player${
            countOf.players.length > 1 ? "s" : ""
          } joined`}
          disabled={isLobbyInGame()}
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
            disabled={isLobbyInGame()}
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

        <RowAction
          title="Round Timer"
          subtitle={`${roundTimer} seconds`}
          disabled={isLobbyInGame()}
          disabled2={isLobbyInGame()}
          {...(isOwner
            ? {
                button: {
                  label: "-",
                  action: () => {
                    if (roundTimer <= 10) {
                      UTIL.toast("Minimum 10 seconds");
                      return;
                    }
                    API.setRoundTimer(lobby, roundTimer - 10);
                  },
                },
                button2: {
                  label: "+",
                  action: () => {
                    if (roundTimer >= 500) {
                      UTIL.toast("You've reached the maximum time limit");
                      return;
                    }
                    API.setRoundTimer(lobby, roundTimer + 10);
                  },
                },
              }
            : {})}
        />

        <Button
          marginT-50
          outline
          text60
          disabled={isLobbyInGame()}
          label="Invite Players"
          onPress={() => setIsShareVisible(true)}
        />
        {isOwner && (
          <>
            {!isLobbyInGame() && (
              <Button
                text40
                marginT-20
                disabled={
                  countOf.words < minWordsToStart ||
                  countOf.players < CONST.GAME_RULES.PLAYER.MIN ||
                  countOf.teams < CONST.GAME_RULES.TEAM.MIN // unlikely to be false
                }
                label="Start game"
                onPress={handleStartGame}
              />
            )}

            <Button
              text40
              bg-red30
              marginT-20
              label="Close Lobby"
              onPress={closeLobby}
            />
          </>
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
      UTIL.toast("An error occurred while sharing");
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
