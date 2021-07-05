import React, { useState, useEffect } from "react";
import { View, Text, ProgressiveImage } from "react-native-ui-lib";

import * as API from "../../utils/api";
import * as UTIL from "../../utils";

const sizeMap = {
  small: {
    image: 50,
    text: { text70: true },
  },
  medium: {
    image: 100,
    text: { text40: true },
  },
  large: {
    image: 250,
    text: { text30: true },
  },
};

export default function PlayerCard({ lobby, uid, size = "small" }) {
  const [user, setUser] = useState(null);

  const playerName = getPlayerName();
  const teamName = getPlayerTeamName();

  useEffect(() => {
    API.getUserByUID(uid)
      .then(setUser)
      .catch((e) => {
        UTIL.toast("Unable to load player");
        console.error(e);
      });
  }, [uid]);

  function getPlayerName() {
    if (!user) return "...";
    return user.username.length >= 25
      ? user.username.slice(0, 25) + "..."
      : user.username;
  }

  function getPlayerTeamName() {
    if (!lobby) return null;
    const team = Object.values(lobby.teams).find((team) => {
      const players = Object.keys(team.players || {});
      return players.includes(uid);
    });
    return team?.displayName || "Unknown";
  }

  return (
    <View
      key={uid}
      style={{
        marginRight: 10,
        marginTop: 10,
        display: "flex",
        alignItems: "center",
        alignContent: "stretch",
      }}
    >
      <ProgressiveImage
        style={{
          height: sizeMap[size].image,
          width: sizeMap[size].image,
          borderRadius: sizeMap[size].image,
          backgroundColor: "#68B7F1",
        }}
        source={{ uri: user?.imageURL, cache: "reload" }}
      />

      <Text center {...sizeMap[size].text}>
        {playerName}
      </Text>
      {teamName && (
        <Text>
          Team <Text color-blue20>{teamName}</Text>
        </Text>
      )}
    </View>
  );
}
