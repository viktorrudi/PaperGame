import React, { useState, useEffect, useRef } from 'react'
import { Vibration } from 'react-native'
import { connect } from 'react-redux'

import { View, Text, Button } from 'react-native-ui-lib'
import * as CONST from '../constants'
import * as UTIL from '../utils'

function Game({ navigation, teams, userInputs }) {
  const allWords = userInputs?.flatMap(({ words }) => words) ?? []
  const init = {
    scores: teams.reduce((scores, team) => {
      scores[team.name] = 0
      return scores
    }, {}),
    unguessedWords: allWords,
    wordToGuess: UTIL.getRandomWord(allWords),
  }

  const timerRef = useRef(null)
  const [round, setRound] = useState(CONST.ROUNDS[0])
  const [queueIndex, setQueueIndex] = useState(0)
  const [guessedWords, setGuessedWords] = useState([])
  const [wordToGuess, setWordToGuess] = useState(init.wordToGuess)
  const [unguessedWords, setUnguessedWords] = useState(init.unguessedWords)

  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [scores, setScores] = useState(init.scores)
  const [timer, setTimer] = useState(null)

  const roundIndex = CONST.ROUNDS.findIndex((type) => round === type)
  const nextRound = CONST.ROUNDS[roundIndex + 1]
  const wasLastRound = roundIndex === CONST.ROUNDS.length - 1

  // FIXME: Player order is incorrect
  const playerQueue = teams.flatMap(({ members }) => members)
  const currentPlayer = playerQueue[queueIndex]
  const isLastPlayer = queueIndex === playerQueue.length - 1

  // TODO: WIP for player order correction
  // const queue = UTIL.generateQueues(playerQueue)
  // console.log(queue)

  const noMoreQuestions = unguessedWords.length === 0
  useEffect(handleTimer, [timer])
  useEffect(checkIfGameOver, [wasLastRound, noMoreQuestions])

  function handleTimer() {
    if (isPlayerReady) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000)
    }

    if (timer <= 0 && isPlayerReady && !noMoreQuestions) {
      setIsPlayerReady(false)

      Vibration.vibrate(1000)
      clearTimeout(timerRef.current)
      setQueueIndex(isLastPlayer ? 0 : queueIndex + 1)
    }
  }

  function checkIfGameOver() {
    if (wasLastRound && noMoreQuestions) {
      navigation.navigate(CONST.ROUTE.GAME_END, { scores })
    }
  }

  function updateScore() {
    const team = teams.find((team) => team.id === currentPlayer.teamID)
    const newScore = { [team.name]: scores[team.name] + 1 }
    setScores({ ...scores, ...newScore })
  }

  function handleGuessedWord(guessedWord) {
    updateScore()
    Vibration.vibrate(100)

    setGuessedWords([...guessedWords, guessedWord])
    const filteredWords = unguessedWords.filter((word) => word !== guessedWord)
    setUnguessedWords(filteredWords)

    if (filteredWords.length > 0) {
      setWordToGuess(UTIL.getRandomWord(filteredWords))
    }
  }

  function gotoNextRound() {
    setQueueIndex(isLastPlayer ? 0 : queueIndex + 1)
    setUnguessedWords(init.unguessedWords)
    setIsPlayerReady(false)
    setRound(nextRound)
  }

  function onPlayerConfirm() {
    setWordToGuess(UTIL.shuffle(unguessedWords)[0])
    setIsPlayerReady(true)
    setTimer(30)
  }

  function renderWordsLeft() {
    return (
      <View right>
        <Text marginT-30 marginR-5>
          Words left this round: {unguessedWords.length}
        </Text>
      </View>
    )
  }

  if (noMoreQuestions) {
    return wasLastRound ? null : (
      <View flex center>
        <Text text40>Round over. Next round is:</Text>
        <Text text20 blue30 marginB-30>
          {CONST.ROUND_TYPE.display[nextRound]}
        </Text>
        <Button text30 label="Let's go!" onPress={gotoNextRound} />
      </View>
    )
  }
  if (!isPlayerReady) {
    return (
      <>
        {renderWordsLeft()}
        <View flex center>
          <Text center text40 marginB-30>
            {`Hand the phone to ${
              currentPlayer.name
            } in ${UTIL.getMemberTeamName(teams, currentPlayer.teamID)}`}
          </Text>
          <Button text30 label="I'm ready!" onPress={onPlayerConfirm} />
        </View>
      </>
    )
  }
  return (
    <>
      {renderWordsLeft()}
      <View flex center>
        <Text text20 center marginB-30>
          {timer}
        </Text>
        <Text text60 center>
          Your word
        </Text>
        <Text text10 marginB-30 blue30 center marginH-20>
          {wordToGuess}
        </Text>
        <Button
          text30
          label="Guessed it!"
          onPress={() => handleGuessedWord(wordToGuess)}
        />
      </View>
    </>
  )
}

const mapStateToProps = (state) => ({
  teams: state.teams || [],
  userInputs: state.userInputs || [],
})

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(Game)
