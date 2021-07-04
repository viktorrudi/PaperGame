import React, { useState } from "react";
import { connect } from "react-redux";
import { ScrollView } from "react-native";
import {
  View,
  Button,
  Text,
  TextField,
  ProgressiveImage,
} from "react-native-ui-lib";
import { TouchableHighlight, Linking } from "react-native";

import * as API from "../../utils/api";
import * as UTIL from "../../utils";
import * as CONST from "../../constants";
import { useFirebaseListener } from "../../utils/hooks";
import { BlurView } from "@react-native-community/blur";

export default function TeamSetup({ navigation, route }) {
  const {
    data: lobby,
    isLoading,
    error,
  } = useFirebaseListener(`/lobbies/${route.params.lobbyID}`, "lobby");
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

  async function handleUpdateTeam(team) {
    await API.updateTeam(lobby.meta.id, team);
  }

  async function handleCreateTeam() {
    await API.createTeam(
      lobby.meta.id,
      UTIL.getDefaultDbProps(API.getCurrentUserUID()).TEAM()
    );
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
              handleUpdate={handleUpdateTeam}
              shouldShow={{
                deleteAction: teams.length > CONST.GAME_RULES.TEAM.MIN,
              }}
            />
          );
        })}

        <Team
          isCreation
          buttonText="Create team"
          mainAction={handleCreateTeam}
        />
      </View>
    </ScrollView>
  );
}

function Team({
  team = {},
  isCreation,
  buttonText = "",
  mainAction = () => {},
  shouldShow = {},
  deleteAction,
  handleUpdate,
}) {
  const players = Object.values(team.players || {});
  const [newTeamName, setNewTeamName] = useState(team.displayName);

  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: 10,
        backgroundColor: "#fafafa",
        padding: 10,
      }}
    >
      {!isCreation && (
        <TextField
          value={newTeamName}
          onChangeText={setNewTeamName}
          onBlur={() => {
            if (newTeamName.length <= 0) {
              setNewTeamName(team.displayName);
              return;
            }
            handleUpdate({ ...team, displayName: newTeamName });
          }}
        />
      )}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >
        {players.map(({ username, imageURL }) => {
          const playerName =
            username.length >= 25 ? username.slice(0, 25) + "..." : username;
          return (
            <View
              key={username + imageURL}
              style={{
                marginRight: 10,
                marginTop: 10,
                maxWidth: 100,
                display: "flex",
                alignItems: "center",
              }}
            >
              <ProgressiveImage
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  backgroundColor: "#68B7F1",
                }}
                source={{ uri: imageURL, cache: "reload" }}
              />

              <Text center>{playerName}</Text>
            </View>
          );
        })}
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
