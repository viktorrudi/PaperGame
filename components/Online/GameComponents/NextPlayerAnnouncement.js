import React, { useState, useEffect } from "react";
import _ from "lodash";
import { ScrollView } from "react-native";
import { View, Text, Button } from "react-native-ui-lib";

import Announcement from "./Announcement";
import PlayerCard from "../PlayerCard";

import * as CONST from "../../../constants";
import * as API_CONST from "../../../constants/api";
import * as API from "../../../utils/api";

export default function NextPlayerAnnouncement({ lobby, roundDetails }) {
  const currentUID = API.getCurrentUserUID();

  const nextPlayerUID = lobby.game.playerQueue[lobby.game.activePlayer];
  const nextIsCurrentPlayer = currentUID === nextPlayerUID;

  async function goToRound() {
    await API.updateLobbyStatus(lobby, CONST.LOBBY_STATUS.IN_ROUND);
  }

  if (!currentUID || !nextPlayerUID) {
    return (
      <View flex center>
        <Text center>Loading</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View flex center>
        <Announcement
          heading={
            nextIsCurrentPlayer
              ? `It's your turn, so get ready!`
              : `Waiting for`
          }
          subheading={roundDetails.TITLE}
          text={roundDetails.HINT}
          action={
            nextIsCurrentPlayer
              ? { label: "I'm ready!", onClick: goToRound }
              : null
          }
        >
          <View center>
            {!nextIsCurrentPlayer && (
              <PlayerCard lobby={lobby} uid={nextPlayerUID} size="large" />
            )}
          </View>
        </Announcement>
      </View>
    </ScrollView>
  );
}
