import React, { useState, useMemo, useEffect, useRef } from "react";
import { Vibration } from "react-native";
import { connect } from "react-redux";

import {
  View,
  Text,
  Button,
  ActionBar,
  Dialog,
  Hint,
} from "react-native-ui-lib";
import * as CONST from "../../constants";
import * as UTIL from "../../utils";

function Game({
  navigation,
  teams = [],
  userInputs = [],
  gameSettings = {},
  dispatch,
}) {
  const allWords = userInputs.flatMap(({ words }) => words);
  const init = {
    scores: teams.reduce((scores, team) => {
      scores[team.name] = 0;
      return scores;
    }, {}),
    unguessedWords: allWords,
    wordToGuess: UTIL.getRandomWord(allWords),
  };

  const playerTimerRef = useRef(null);
  const [playerTimeleft, setPlayerTimeLeft] = useState(null);

  const [isWelcomeShowing, setIsWelcomeShowing] = useState(true);
  const [wordToGuess, setWordToGuess] = useState(init.wordToGuess);
  const [guessedWords, setGuessedWords] = useState([]);
  const [unguessedWords, setUnguessedWords] = useState(init.unguessedWords);

  const [queueIndex, setQueueIndex] = useState(0);
  const [round, setRound] = useState(CONST.ROUNDS[0]);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [scores, setScores] = useState(init.scores);

  const [showSkipTurnDialog, setShowSkipTurnDialog] = useState(false);
  const [showEndGameDialog, setShowEndGameDialog] = useState(false);
  const [showRoundTypeHint, setShowRoundTypeHint] = useState(false);

  const roundIndex = CONST.ROUNDS.findIndex((type) => round === type);
  const nextRound = CONST.ROUNDS[roundIndex + 1];
  const wasLastRound = roundIndex === CONST.ROUNDS.length - 1;

  const allMembers = teams.flatMap(({ members }) => members);
  const playerQueue = useMemo(() => UTIL.generateQueues(allMembers), []);
  const currentPlayer = playerQueue[queueIndex];
  const isLastPlayer = queueIndex === playerQueue.length - 1;

  const isRoundOver = unguessedWords.length === 0;
  const isGameOver = wasLastRound && isRoundOver;

  useEffect(handleTimer, [playerTimeleft]);
  useEffect(onGameOver, [isGameOver]);

  function handleTimer() {
    if (!isPlayerReady) return;

    playerTimerRef.current = setTimeout(
      () => setPlayerTimeLeft(playerTimeleft - 1),
      1000
    );

    if (playerTimeleft <= 0 && !isRoundOver) {
      setShowEndGameDialog(false);
      setIsPlayerReady(false);

      Vibration.vibrate(1000);
      clearTimeout(playerTimerRef.current);
      setQueueIndex(isLastPlayer ? 0 : queueIndex + 1);
    }
  }

  function onGameOver() {
    if (isGameOver) {
      navigation.navigate(CONST.ROUTE.GAME_END, { scores });
    }
  }

  function toggleRoundHint() {
    setShowRoundTypeHint(!showRoundTypeHint);
  }

  function updateScore() {
    const team = teams.find((team) => team.id === currentPlayer.teamID);
    const newScore = { [team.name]: scores[team.name] + 1 };
    setScores({ ...scores, ...newScore });
  }

  function handleGuessedWord(guessedWord) {
    updateScore();
    Vibration.vibrate(100);

    setGuessedWords([...guessedWords, guessedWord]);
    const filteredWords = unguessedWords.filter((word) => word !== guessedWord);
    setUnguessedWords(filteredWords);

    if (filteredWords.length > 0) {
      setWordToGuess(UTIL.getRandomWord(filteredWords));
    }
  }

  function gotoNextRound() {
    setQueueIndex(isLastPlayer ? 0 : queueIndex + 1);
    setUnguessedWords(init.unguessedWords);
    setIsPlayerReady(false);
    setRound(nextRound);
  }

  function skipPlayerTurn() {
    setShowSkipTurnDialog(false);
    setPlayerTimeLeft(0);
  }

  function onPlayerConfirm() {
    setWordToGuess(UTIL.shuffle(unguessedWords)[0]);
    setIsPlayerReady(true);
    setPlayerTimeLeft(gameSettings.roundTimer);
  }

  function confirmEndGame() {
    dispatch({ type: CONST.ACTION.RESTART });
    navigation.navigate(CONST.ROUTE.MAIN_MENU);
  }

  if (isGameOver) return null;

  if (isWelcomeShowing) {
    return (
      <View flex center>
        <Text text40 marginB-10>
          First round is
        </Text>
        <Text text20 blue30>
          {CONST.ROUND_TYPE.display[round]}
        </Text>
        <Text center marginB-30>
          {CONST.ROUND_TYPE_HINT[round]}
        </Text>
        <Button
          text30
          label="Let's get started!"
          onPress={() => setIsWelcomeShowing(false)}
        />
      </View>
    );
  }

  if (isRoundOver) {
    return (
      <View flex center>
        <Text text40 marginB-10>
          Round over. Next round is:
        </Text>
        <Text text20 blue30>
          {CONST.ROUND_TYPE.display[nextRound]}
        </Text>
        <Text center marginB-30>
          {CONST.ROUND_TYPE_HINT[nextRound]}
        </Text>
        <Button text30 label="Let's go!" onPress={gotoNextRound} />
      </View>
    );
  }
  if (!isPlayerReady) {
    const currentTeam = teams.find((team) => team.id === currentPlayer.teamID);
    return (
      <View flex center>
        <Text center text40 marginB-30>
          {`Hand the phone to ${currentPlayer.name} in ${currentTeam.name}`}
        </Text>
        <Button text30 label="I'm ready!" onPress={onPlayerConfirm} />
        <Text center marginT-10>
          {CONST.ROUND_TYPE_HINT[round]}
        </Text>
      </View>
    );
  }
  return (
    <>
      <Dialog
        visible={showEndGameDialog}
        onDismiss={() => setShowEndGameDialog(false)}
      >
        <View>
          <Text center text40 white>
            Are you sure you want to end the game?
          </Text>
          <Button
            bg-red30
            text40
            marginV-20
            label="End game"
            onPress={confirmEndGame}
          />
          <Button
            text40
            label="Continue Playing"
            onPress={() => setShowEndGameDialog(false)}
          />
        </View>
      </Dialog>

      <Dialog
        visible={showSkipTurnDialog}
        onDismiss={() => setShowSkipTurnDialog(false)}
      >
        <View>
          <Text center text40 white>
            Are you sure you want to end your turn?
          </Text>
          <Button
            bg-red30
            text40
            marginV-20
            label="End turn"
            onPress={skipPlayerTurn}
          />
          <Button
            text40
            label="Continue Playing"
            onPress={() => setShowSkipTurnDialog(false)}
          />
        </View>
      </Dialog>

      <View flex center style={{ height: "100%" }}>
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
        {showRoundTypeHint && (
          <View style={{ position: "absolute", bottom: 70 }}>
            <Text center style={{ alignSelf: "flex-end" }}>
              {CONST.ROUND_TYPE_HINT[round]}
            </Text>
          </View>
        )}
        <Button
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
        />
      </View>
    </>
  );
}

const mapStateToProps = (state) => ({
  teams: state.teams || [],
  userInputs: state.userInputs || [],
  gameSettings: state.gameSettings || {},
});

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(Game);
