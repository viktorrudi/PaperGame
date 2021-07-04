import React, { useState, useEffect, useRef } from "react";
import { Vibration } from "react-native";
import * as CONST from "../../../constants";
import * as API from "../../../utils/api";
import * as API_CONST from "../../../constants/api";

import { View, Button, Dialog, Text, ActionBar } from "react-native-ui-lib";

export default function WordExpression({ lobby }) {
  const playerTimerRef = useRef(null);
  const [playerTimeleft, setPlayerTimeLeft] = useState(
    parseInt(lobby.rules.roundTimer) || 30
  );

  const currentUID = API.getCurrentUserUID();
  const activePlayerUID = lobby.game.playerQueue[lobby.game.activePlayer];
  const currentPlayerIsActive = currentUID === activePlayerUID;

  const currentWordID = Object.values(lobby.game.activeWordIDs)[0];
  const currentWordDetails = lobby.game.availableWords[currentWordID];
  const wordsLeftCount = Object.keys(lobby.game.availableWords || {}).length;

  useEffect(handleTimer, [playerTimeleft]);

  async function handleGuessedWord() {
    const isLastWord = wordsLeftCount === 1;
    if (isLastWord) {
      const nextRoundStatus = await API.setNextRound(lobby);
      if (nextRoundStatus === API_CONST.LOBBY_STATUS.GAME_OVER) return;
      await API.resetAvailableWords(lobby);
      return;
    }
    await API.addGuessedWord(lobby);
  }

  async function goToNextPlayer() {
    await API.setNextActivePlayer(lobby);
    await API.updateLobbyStatus(
      lobby,
      API_CONST.LOBBY_STATUS.PLAYER_ANNOUNCEMENT
    );
  }

  function handleTimer() {
    if (!currentPlayerIsActive) return;

    playerTimerRef.current = setTimeout(
      () => setPlayerTimeLeft(playerTimeleft - 1),
      1000
    );

    if (playerTimeleft <= 0) {
      Vibration.vibrate(1000);
      clearTimeout(playerTimerRef.current);
      goToNextPlayer();
    }
  }

  if (!currentPlayerIsActive) {
    return (
      <View flex center style={{ height: "100%", marginTop: 300 }}>
        <Text text20 center marginB-30>
          Not your turn
        </Text>
      </View>
    );
  }

  return (
    <View flex center style={{ height: "100%", marginTop: 300 }}>
      <Text text20 center marginB-30>
        {playerTimeleft}
      </Text>
      <Text text60 center>
        Your word is
      </Text>
      <Text text10 marginB-30 blue30 center marginH-20>
        {currentWordDetails.word}
      </Text>
      <Button text30 label="Guessed it!" onPress={handleGuessedWord} />
      {/* {showRoundTypeHint && (
        <View style={{ position: "absolute", bottom: 70 }}>
          <Text center style={{ alignSelf: "flex-end" }}>
            {CONST.ROUND_TYPE_HINT[round]}
          </Text>
        </View>
      )} */}
      {/* <Button
        size="medium"
        backgroundColor="#c0c0c0"
        marginT-20
        label="End my turn"
        onPress={() => setShowSkipTurnDialog(true)}
      />  */}
      <ActionBar
        actions={[
          // {
          //   label: "End game",
          //   red30: true,
          //   onPress: () => setShowEndGameDialog(true),
          // },
          // {
          //   label: `Round: ${CONST.ROUND_TYPE.display[round]}`,
          //   labelStyle: { fontWeight: "bold" },
          //   onPress: toggleRoundHint,
          // },
          { label: `Words left: ${wordsLeftCount}` },
        ]}
      />
    </View>
  );
}
