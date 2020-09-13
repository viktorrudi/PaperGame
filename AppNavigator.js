import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import MainMenu from './components/MainMenu'
import GameSettings from './components/GameSettings'
import TeamSetup from './components/Setup/TeamSetup'
import WordSetup from './components/Setup/WordSetup'
import Game from './components/Game'
import GameEnd from './components/GameEnd'

import * as CONST from './constants'

const Stack = createStackNavigator()

const headerStyle = {
  headerStyle: {
    backgroundColor: '#000',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  gestureDirection: 'horizontal',
}

const screens = {
  [CONST.ROUTE.MAIN_MENU]: {
    Component: MainMenu,
  },
  [CONST.ROUTE.GAME]: {
    Component: Game,
  },
  [CONST.ROUTE.GAME_END]: {
    Component: GameEnd,
  },
  [CONST.ROUTE.GAME_SETTINGS]: {
    Component: GameSettings,
    options: {
      title: 'Settings',
      ...headerStyle,
    },
  },
  [CONST.ROUTE.SETUP_TEAM]: {
    Component: TeamSetup,
    options: {
      title: 'Set up teams',
      ...headerStyle,
    },
  },
  [CONST.ROUTE.SETUP_WORDS]: {
    Component: WordSetup,
    options: {
      title: 'Add some words',
      ...headerStyle,
    },
  },
}
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {Object.entries(screens).map(
          ([routeRef, { Component, options = { headerShown: false } }]) => (
            <Stack.Screen
              key={routeRef}
              name={routeRef}
              component={Component}
              options={options}
            />
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
