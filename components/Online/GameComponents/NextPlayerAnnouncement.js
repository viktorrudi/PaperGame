import React, { useState, useEffect } from "react";
import _ from "lodash";

import Announcement from "./Announcement";

import * as CONST from "../../../constants";
import * as API_CONST from "../../../constants/api";
import * as API from "../../../utils/api";

export default function NextPlayerAnnouncement({ lobby }) {
  const currentUID = API.getCurrentUserUID();
  const [nextPlayer, setNextPlayer] = useState(null);

  const nextPlayerUID = lobby.game.playerQueue[lobby.game.activePlayer];
  const nextIsCurrentPlayer = currentUID === nextPlayerUID;

  useEffect(() => {
    async function getNextPlayer() {
      const nextPlayerDetails = await API.getUserByUID(nextPlayerUID);
      // console.log({ nextPlayer, currentUID, nextPlayerDetails });

      setNextPlayer(nextPlayerDetails);
    }
    getNextPlayer();
  }, [nextPlayerUID]);

  async function gotoNextRound() {
    await API.updateLobbyStatus(lobby, API_CONST.LOBBY_STATUS.ROUND_TWO);
  }

  function getPlayerTeamName(uid) {
    const team = Object.values(lobby.teams).find((team) => {
      const players = Object.keys(team.players);
      return players.includes(uid);
    });
    return team?.displayName || "Unknown";
  }

  if (!nextPlayer) {
    return null;
  }

  return (
    <Announcement
      heading={
        nextIsCurrentPlayer
          ? `You're up, ${nextPlayer.username}! Get ready!`
          : `Waiting for ${nextPlayer.username || ""} in ${getPlayerTeamName(
              nextPlayerUID
            )} to get ready`
      }
      subheading=""
      text={CONST.ROUND_TYPE_HINT[lobby.meta.status]}
      action={
        nextIsCurrentPlayer
          ? { label: "I'm ready!", onClick: gotoNextRound }
          : null
      }
    />
  );
}