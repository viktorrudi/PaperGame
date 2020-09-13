import React from 'react'
import { connect } from 'react-redux'

import { ScrollView } from 'react-native'
import { View, Text, Button } from 'react-native-ui-lib'
import * as CONST from '../constants'
import * as UTIL from '../utils'

function GameEnd({ navigation, route, dispatch, userInputs, teams }) {
  const { scores } = route.params
  const winner = UTIL.getWinner(scores)
  const winningMembers = teams.find((team) => team.name === winner.team)
    ?.members

  function restartGame() {
    dispatch({ type: CONST.ACTION.RESTART })
    navigation.navigate(CONST.ROUTE.SETUP_TEAM)
  }

  function endGame() {
    dispatch({ type: CONST.ACTION.RESTART })
    navigation.navigate(CONST.ROUTE.MAIN_MENU)
  }

  return (
    <ScrollView>
      <View flex center>
        <View marginV-60 marginH-20>
          <Text center>Winner is</Text>
          <Text center text20 blue20 marginB-10>
            {winner.team}
          </Text>
          <Text center text40 blue20>
            Congratulations, intellectuals{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {winningMembers?.map(({ name }) => name).join(' and ')}
            </Text>
          </Text>
        </View>
        <View bg-blue60 style={{ width: '100%', padding: 20 }}>
          <Text text70 center style={{ textTransform: 'uppercase' }}>
            Final scores
          </Text>
          {Object.entries(scores).map(([team, score]) => (
            <View
              key={team}
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 10,
              }}
            >
              <Text text70 dark20 style={{ paddingTop: 5 }}>
                {team}
              </Text>
              <Text text70 style={{ fontWeight: 'bold', paddingTop: 5 }}>
                {score} points
              </Text>
            </View>
          ))}
        </View>
        <View bg-green60 style={{ width: '100%', padding: 20, marginTop: 5 }}>
          <Text text70 center style={{ textTransform: 'uppercase' }}>
            Words and their creators
          </Text>
          {userInputs.map(({ owner, words }) => (
            <View key={owner.member.name} style={{ marginTop: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>{owner.member.name}</Text>
              <Text>{words.join(', ')}</Text>
            </View>
          ))}
        </View>

        <Button
          style={{ width: '90%' }}
          label="Restart"
          onPress={restartGame}
          marginV-20
        />
        <Button
          style={{ width: '90%' }}
          label="Go back to main menu"
          outline
          onPress={endGame}
          marginB-20
        />
      </View>
    </ScrollView>
  )
}

const mapStateToProps = (state) => ({
  userInputs: state.userInputs || [],
  teams: state.teams || [],
})

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(GameEnd)
