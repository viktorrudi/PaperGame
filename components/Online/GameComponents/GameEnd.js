import React, { useState, useEffect, useRef } from "react";

import * as CONST from "../../../constants";
import * as API from "../../../utils/api";
import * as API_CONST from "../../../constants/api";

import { ScrollView } from "react-native";
import { View, Button, Dialog, Text, ActionBar } from "react-native-ui-lib";

function GameEnd({ navigation, lobby }) {
  function getTeamsByScore() {
    return Object.values(lobby.teams).sort((a, b) => a.score - b.score);
  }
  function getWinnerTeam() {
    const winnerTeam = Object.values(lobby.teams).reduce(
      (otherTeam = {}, team) => {
        return otherTeam?.score > team.score ? otherTeam : team;
      },
      {}
    );
    return winnerTeam;
  }

  function getWinnerPlayers() {
    return Object.values(getWinnerTeam().players);
  }

  function backToMainMenu() {
    console.log(navigation);
    navigation.navigate(CONST.ROUTE.MAIN_MENU);
  }

  return (
    <ScrollView>
      <View flex center>
        <View marginV-60 marginH-20>
          <Text center>Winner is</Text>
          <Text center text20 blue20 marginB-10>
            {getWinnerTeam().displayName}
          </Text>
          <Text center text40 blue20>
            Congratulations, intellectuals{" "}
            <Text style={{ fontWeight: "bold" }}>
              {getWinnerPlayers()
                .map((player) => player.username)
                .join(" and ")}
            </Text>
          </Text>
        </View>
        <View bg-blue60 style={{ width: "100%", padding: 20 }}>
          <Text text70 center style={{ textTransform: "uppercase" }}>
            Final scores
          </Text>

          {getTeamsByScore().map((team) => (
            <View
              key={team.displayName}
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: 10,
              }}
            >
              <Text text70 dark20 style={{ paddingTop: 5 }}>
                {team.displayName}
              </Text>
              <Text text70 style={{ fontWeight: "bold", paddingTop: 5 }}>
                {team.score} points
              </Text>
            </View>
          ))}
        </View>
        <View bg-green60 style={{ width: "100%", padding: 20, marginTop: 5 }}>
          <Text text70 center style={{ textTransform: "uppercase" }}>
            Words and their creators
          </Text>
          {Object.values({
            ...lobby.game.availableWords,
            ...lobby.game.guessedWords,
          }).map(({ author, word }) => {
            return (
              <View key={author} style={{ marginTop: 5 }}>
                {/* <Text style={{ fontWeight: "bold" }}>{author}</Text> */}
                <Text>{word}</Text>
              </View>
            );
          })}
        </View>

        <Button
          style={{ width: "90%" }}
          label="Go to the main menu"
          onPress={backToMainMenu}
          marginV-20
        />
      </View>
    </ScrollView>
  );
}

export default GameEnd;
