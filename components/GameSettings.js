import React, { useState } from 'react'
import { connect } from 'react-redux'

import { ScrollView } from 'react-native'
import { View, Button, TextField } from 'react-native-ui-lib'

import * as CONST from '../constants'

function GameSettings({ navigation, dispatch, gameSettings }) {
  const [minWords, setMinWords] = useState(gameSettings.minWords.toString())
  const [roundTimer, setRoundTimer] = useState(
    gameSettings.roundTimer.toString()
  )
  // const [powerPointsPerRound, setPowerPointsPerRound] = useState(
  //   gameSettings.powerPointsPerRound.toString()
  // )

  function saveSettings() {
    dispatch({
      type: CONST.ACTION.UPDATE_GAME_SETTINGS,
      payload: {
        roundTimer: parseInt(roundTimer.trim()),
        // powerPointsPerRound: parseInt(powerPointsPerRound.trim()),
        minWords: parseInt(minWords.trim()),
      },
    })
    navigation.navigate(CONST.ROUTE.MAIN_MENU)
  }

  function checkForErrors() {
    const states = [minWords, roundTimer]
    return states.some((state) => state.length === 0 || isNaN(state))
  }

  return (
    <ScrollView style={{ margin: 20 }}>
      <View flex>
        <TextField
          text30
          title="Round timer"
          floatOnFocus
          value={roundTimer}
          keyboardType="numeric"
          onChangeText={(timer) => setRoundTimer(timer)}
        />
        {/* <TextField
          text30
          title="Teams starting Power Points per round"
          floatOnFocus
          value={powerPointsPerRound}
          keyboardType="numeric"
          onChangeText={(points) => setPowerPointsPerRound(points)}
        /> */}
        <TextField
          text30
          title="Minimum required words per player"
          floatOnFocus
          value={minWords}
          keyboardType="numeric"
          onChangeText={(wordsAmount) => setMinWords(wordsAmount)}
        />
        <Button
          disabled={checkForErrors()}
          label="Save"
          onPress={saveSettings}
        />
      </View>
    </ScrollView>
  )
}

const mapStateToProps = (state) => ({
  gameSettings: state.gameSettings || {},
})

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(
  GameSettings
)
