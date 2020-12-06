import React, { useState } from "react";
import { connect } from "react-redux";
import { ScrollView } from "react-native";
import { View, Button, Text, TextField } from "react-native-ui-lib";
import { TouchableHighlight, Linking } from "react-native";

import * as API from "../../utils/api";
import * as UTIL from "../../utils";
import * as CONST from "../../constants";
import { useFirebaseListener } from "../../utils/hooks";

export default function TeamSetup({ navigation, route }) {
  const { data: lobby, isLoading, error } = useFirebaseListener(
    `/lobbies/${route.params.lobbyID}`,
    "lobby"
  );
  if (isLoading) return <Text>Loading</Text>;
  if (!lobby || error) return <Text>Sorry, something happened</Text>;

  const teams = Object.values(lobby.teams || {});

  async function handleJoinTeam(team) {
    await API.joinTeam(lobby.meta.id, team.id);
  }

  async function handleLeaveTeam(team) {
    await API.leaveTeam(lobby.meta.id, team.id);
  }

  async function handleDeleteTeam(team) {
    await API.deleteTeam(lobby.meta.id, team.id);
  }

  async function handleCreateTeam() {
    await API.createTeam(lobby.meta.id, CONST.DEFAULT_DB_PROPS.TEAM());
  }

  return (
    <ScrollView>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          margin: 10,
        }}
      >
        {teams.map((team) => {
          const isInThisTeam =
            team.players && API.getCurrentUserUID() in team.players;
          return (
            <Team
              key={team.id}
              team={team}
              buttonText={isInThisTeam ? "Leave" : "Join"}
              deleteAction={handleDeleteTeam}
              mainAction={isInThisTeam ? handleLeaveTeam : handleJoinTeam}
              shouldShow={{
                deleteAction: teams.length > CONST.GAME_RULES.TEAM.MIN,
              }}
            />
          );
        })}

        <Team buttonText="Create team" mainAction={handleCreateTeam} />
      </View>
    </ScrollView>
  );
}

function Team({
  team = {},
  buttonText = "",
  mainAction = () => {},
  shouldShow = {},
  deleteAction,
}) {
  const players = Object.values(team.players || {});
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: 10,
        padding: 10,

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
      }}
    >
      <Text text50>{team.displayName}</Text>
      <View>
        {players.map((player) => (
          <Text>{player.username}</Text>
        ))}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Button label={buttonText} onPress={() => mainAction(team)} />
        {shouldShow.deleteAction && (
          <Button
            size="small"
            label="Delete"
            outline
            red30
            style={{ borderColor: "red" }}
            onPress={() => deleteAction(team)}
          />
        )}
      </View>
    </View>
  );
}
