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

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={CONST.ROUTE.MAIN_MENU}
          component={MainMenu}
          options={{
            title: 'Paper Game',
            ...headerStyle,
          }}
        />
        <Stack.Screen
          name={CONST.ROUTE.GAME_SETTINGS}
          component={GameSettings}
          options={{
            title: 'Settings',
            ...headerStyle,
          }}
        />
        <Stack.Screen
          name={CONST.ROUTE.SETUP_TEAM}
          component={TeamSetup}
          options={{
            title: 'Set up teams',
            ...headerStyle,
          }}
        />
        <Stack.Screen
          name={CONST.ROUTE.SETUP_WORDS}
          component={WordSetup}
          options={{
            title: 'Add some words',
            ...headerStyle,
          }}
        />
        <Stack.Screen
          name={CONST.ROUTE.GAME}
          component={Game}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={CONST.ROUTE.GAME_END}
          component={GameEnd}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="TaskSetup"
          component={TaskSetup}
          // options={{
          //   title: 'Categories',
          //   headerRight: () =>
          //     totalCorrect > 0 && (
          //       <Button title={`Total Score: ${String(totalCorrect)}`} />
          //     ),
          //   ...headerStyle,
          // }}
        />
        <Stack.Screen
          name="Task"
          component={Task}
          options={({ route }) => ({
            title: route.params.category.name,
            ...headerStyle,
          })}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
