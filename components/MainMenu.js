import React from 'react'
import { View, Text, Button } from 'react-native-ui-lib'
import * as CONST from '../constants'

export default function MainMenu({ navigation }) {
  return (
    <View flex center>
      <Text text50 marginB-30 blue30>
        Welcome to Paper Game!
      </Text>
      <Button
        text40
        marginB-20
        label="Start game"
        style={{ width: '70%' }}
        onPress={() => navigation.navigate(CONST.ROUTE.SETUP_TEAM)}
      />
      <Button
        text40
        label="Settings"
        style={{ width: '70%' }}
        onPress={() => navigation.navigate(CONST.ROUTE.GAME_SETTINGS)}
      />
    </View>
  )
}
