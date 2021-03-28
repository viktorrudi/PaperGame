import React, { useState, useEffect, useRef } from "react";
import { Vibration } from "react-native";

import { View, Button, Dialog, Text } from "react-native-ui-lib";

export default function WordExpression({ lobby }) {
  const playerTimerRef = useRef(null);
  const [playerTimeleft, setPlayerTimeLeft] = useState(30);
  const wordToGuess = "test";

  useEffect(handleTimer, [playerTimeleft]);

  function handleTimer() {
    playerTimerRef.current = setTimeout(
      () => setPlayerTimeLeft(playerTimeleft - 1),
      1000
    );

    if (playerTimeleft <= 0) {
      Vibration.vibrate(1000);
      clearTimeout(playerTimerRef.current);
    }
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
        {wordToGuess}
      </Text>
      <Button
        text30
        label="Guessed it!"
        onPress={() => handleGuessedWord(wordToGuess)}
      />
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
      />
      <ActionBar
        actions={[
          {
            label: "End game",
            red30: true,
            onPress: () => setShowEndGameDialog(true),
          },
          {
            label: `Round: ${CONST.ROUND_TYPE.display[round]}`,
            labelStyle: { fontWeight: "bold" },
            onPress: toggleRoundHint,
          },
          { label: `Words left: ${unguessedWords.length}` },
        ]}
      /> */}
    </View>
  );
}
