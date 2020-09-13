import React from 'react'
import { TouchableHighlight, Linking } from 'react-native'
import { View, Text, Button, Image } from 'react-native-ui-lib'
import * as CONST from '../constants'
import githubLogo from '../assets/github-logo.png'

export default function MainMenu({ navigation }) {
  return (
    <View flex center>
      <Text text20 blue30>
        Paper Game
      </Text>
      <Text text80 marginB-30 grey40>
        v{CONST.VERSION_NUMBER}
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
      <TouchableHighlight
        style={{ position: 'absolute', bottom: 10, right: 10 }}
        onPress={() => Linking.openURL(CONST.GITHUB_REPO_URL)}
      >
        <Image
          style={{
            width: 40,
            height: 40,
          }}
          source={githubLogo}
        />
      </TouchableHighlight>
    </View>
  )
}
