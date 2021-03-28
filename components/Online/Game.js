import React from "react";
import { View, Button, Dialog, Text } from "react-native-ui-lib";

import Announcement from "./GameComponents/Announcement";
import WordExpression from "./GameComponents/WordExpression";

import * as API from "../../utils/api";
import * as CONST from "../../constants/index";
import * as CONST_API from "../../constants/api";

import { useFirebaseListener } from "../../utils/hooks";

const { LOBBY_STATUS } = CONST_API;

export default function Game({ navigation, route }) {
  const uid = API.getCurrentUserUID();
  const { lobbyID } = route.params;
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
  if (!lobby || !lobby.meta?.status) return null;

  const components = {
    [LOBBY_STATUS.PAUSE_ROUND_ONE]: () => (
      <Announcement
        heading="Let's get started!"
        subheading={CONST.ROUND_TYPE.display[lobby.meta.status]}
        text={CONST.ROUND_TYPE_HINT[lobby.meta.status]}
        action={{ label: "Let's go!", onClick: () => {} }}
      />
    ),
    [LOBBY_STATUS.PAUSE_ROUND_TWO]: () => (
      <Announcement
        heading="Let's get started!"
        subheading={CONST.ROUND_TYPE.display[lobby.meta.status]}
        text={CONST.ROUND_TYPE_HINT[lobby.meta.status]}
        action={{ label: "Let's go!", onClick: () => {} }}
      />
    ),
    [LOBBY_STATUS.PAUSE_ROUND_THREE]: () => (
      <Announcement
        heading="Let's get started!"
        subheading={CONST.ROUND_TYPE.display[lobby.meta.status]}
        text={CONST.ROUND_TYPE_HINT[lobby.meta.status]}
        action={{ label: "Let's go!", onClick: () => {} }}
      />
    ),
    [LOBBY_STATUS.PAUSE_UP_NEXT]: () => (
      <Announcement
        heading={`Hand the phone to A in B`}
        subheading=""
        text={CONST.ROUND_TYPE_HINT[lobby.meta.status]}
        action={{ label: "I'm ready!", onClick: () => {} }}
      />
    ),
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
