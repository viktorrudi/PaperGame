import React from "react";
import { View, Button, Dialog, Text } from "react-native-ui-lib";

import NextPlayerAnnouncement from "./GameComponents/NextPlayerAnnouncement";
import Announcement from "./GameComponents/Announcement";
import WordExpression from "./GameComponents/WordExpression";
import GameEnd from "./GameComponents/GameEnd";

import * as API from "../../utils/api";
import * as CONST from "../../constants";
import * as CONST_API from "../../constants/api";

import { useFirebaseListener } from "../../utils/hooks";

const { LOBBY_STATUS } = CONST_API;

export default function Game({ navigation, route }) {
  const { lobbyID } = route.params;
  const {
    data: lobby = {},
    isLoading,
    error,
  } = useFirebaseListener(`/lobbies/${lobbyID}`, "lobby");
  if (!lobby || !lobby.meta?.status) return null;

  const roundDetails = CONST.ROUND_DETAILS_BY_ORDER[lobby.game.activeRound];
  const isInRound = lobby.meta.status === LOBBY_STATUS.IN_ROUND;

  const metaComponents = {
    [LOBBY_STATUS.ROUND_EXPLANATION]: () => (
      <Announcement
        heading="The rules of this round"
        subheading={roundDetails.TITLE}
        text={roundDetails.HINT}
        action={{
          label: "Let's go!",
          onClick: async () => {
            await API.updateLobbyStatus(
              lobby,
              LOBBY_STATUS.PLAYER_ANNOUNCEMENT
            );
          },
        }}
      />
    ),
    [LOBBY_STATUS.PLAYER_ANNOUNCEMENT]: () => (
      <NextPlayerAnnouncement roundDetails={roundDetails} lobby={lobby} />
    ),
    [LOBBY_STATUS.GAME_OVER]: () => (
      <GameEnd navigation={navigation} lobby={lobby} />
    ),
  };

  const MetaComponent = metaComponents[lobby.meta.status];
  if (!MetaComponent && !isInRound) {
    return (
      <View>
        <Text bg-red30 text40 marginV-20>
          Unable to find component
        </Text>
      </View>
    );
  }

  return isInRound ? (
    <WordExpression lobby={lobby} roundDetails={roundDetails} />
  ) : (
    <MetaComponent />
  );
}
