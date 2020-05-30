import React from 'react'
import { connect } from 'react-redux'

import { View, Text, Button } from 'react-native-ui-lib'
import * as CONST from '../constants'

function GameEnd({ navigation, route, dispatch }) {
  const { scores } = route.params
  console.log({ scores })
  function handleRestart() {
    dispatch({ type: CONST.ACTION.RESTART })
    navigation.navigate(CONST.ROUTE.SETUP_TEAM)
  }
  return (
    <View flex center>
      {Object.entries(scores).map(([team, score]) => (
        <Text key={team}>
          {team} got {score} points
        </Text>
      ))}
      <Button label="Restart" onPress={handleRestart} />
    </View>
  )
}
export default connect(null, (dispatch) => ({ dispatch }))(GameEnd)
