import React, { useState } from "react";
import { ScrollView } from "react-native";
import { View, Button, Text, TextField } from "react-native-ui-lib";

import PlayerCard from "./PlayerCard";
import FullScreenLoader from "../FullScreenLoader";

import * as API from "../../utils/api";
import * as UTIL from "../../utils";
import * as CONST from "../../constants";
import { useFirebaseListener } from "../../utils/hooks";

export default function TeamSetup({ navigation, route }) {
  const {
    data: lobby,
    isLoading,
    error,
  } = useFirebaseListener(`/lobbies/${route.params.lobbyID}`, "lobby");
  if (isLoading) return <FullScreenLoader />;
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
      API.getDefaultDbProps(API.getCurrentUserUID()).TEAM()
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
              buttonText={isInThisTeam ? "Leave Team" : "Join Team"}
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
          buttonText="Create another Team"
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
  const [newTeamName, setNewTeamName] = useState(team.displayName);

  const playerUids = Object.keys(team.players || {});

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
          title="Team Name"
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
        }}
      >
        {playerUids.length === 0 ? (
          <Text>{isCreation ? "" : "No players here yet"}</Text>
        ) : (
          playerUids.map((uid) => <PlayerCard uid={uid} size="medium" />)
        )}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Button
          style={isCreation ? { display: "flex", flexGrow: 1, height: 70 } : {}}
          label={buttonText}
          onPress={() => mainAction(team)}
        />
        {shouldShow.deleteAction && (
          <Button
            size="small"
            label="Remove Team"
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
