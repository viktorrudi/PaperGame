import React from "react";
import { View, Button, Dialog, Text } from "react-native-ui-lib";

import NextPlayerAnnouncement from "./GameComponents/NextPlayerAnnouncement";
import Announcement from "./GameComponents/Announcement";
import WordExpression from "./GameComponents/WordExpression";

import * as API from "../../utils/api";
import * as CONST from "../../constants/index";
import * as CONST_API from "../../constants/api";

import { useFirebaseListener } from "../../utils/hooks";

const { LOBBY_STATUS } = CONST_API;

export default function Game({ navigation, route }) {
  const { lobbyID } = route.params;
  const { data: lobby = {}, isLoading, error } = useFirebaseListener(
    `/lobbies/${lobbyID}`,
    "lobby"
  );
  if (!lobby || !lobby.meta?.status) return null;

  const components = {
    // Round explanation
    [LOBBY_STATUS.PAUSE_ROUND_ONE]: () => (
      <Announcement
        heading="Let's get started!"
        subheading={CONST.ROUND_TYPE.display[lobby.meta.status]}
        text={CONST.ROUND_TYPE_HINT[lobby.meta.status]}
        action={{
          label: "Let's go!",
          onClick: async () => {
            await API.updateLobbyStatus(lobby, LOBBY_STATUS.PAUSE_NEXT_PLAYER);
          },
        }}
      />
    ),
    [LOBBY_STATUS.PAUSE_ROUND_TWO]: () => (
      <Announcement
        heading="Let's get started!"
        subheading={CONST.ROUND_TYPE.display[lobby.meta.status]}
        text={CONST.ROUND_TYPE_HINT[lobby.meta.status]}
        action={{
          label: "Let's go!",
          onClick: async () => {
            await API.updateLobbyStatus(lobby, LOBBY_STATUS.PAUSE_NEXT_PLAYER);
          },
        }}
      />
    ),
    [LOBBY_STATUS.PAUSE_ROUND_THREE]: () => (
      <Announcement
        heading="Let's get started!"
        subheading={CONST.ROUND_TYPE.display[lobby.meta.status]}
        text={CONST.ROUND_TYPE_HINT[lobby.meta.status]}
        action={{
          label: "Let's go!",
          onClick: async () => {
            await API.updateLobbyStatus(lobby, LOBBY_STATUS.PAUSE_NEXT_PLAYER);
          },
        }}
      />
    ),
    // Next Player
    [LOBBY_STATUS.PAUSE_NEXT_PLAYER]: () => (
      <NextPlayerAnnouncement lobby={lobby} />
    ),
    // In Round
    [LOBBY_STATUS.ROUND_ONE]: () => <WordExpression lobby={lobby} />,
    [LOBBY_STATUS.ROUND_TWO]: () => <WordExpression lobby={lobby} />,
    [LOBBY_STATUS.ROUND_THREE]: () => <WordExpression lobby={lobby} />,
  };

  const GameComponent = components[lobby.meta.status];
  if (!GameComponent) {
    return (
      <View>
        <Text bg-red30 text40 marginV-20>
          Unable to find component
        </Text>
      </View>
    );
  }

  return (
    <View>
      <GameComponent lobby={lobby} />
    </View>
  );
}
