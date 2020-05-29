import React from 'react'
// import { StyleSheet, Text } from 'react-native'
import { Provider } from 'react-redux'
import { View } from 'react-native-ui-lib'
import MainMenu from './components/MainMenu'
import AppNavigator from './AppNavigator'

import { store } from './store'

export default function App() {
  return (
    <Provider store={store}>
      {/* <MainMenu /> */}
      <AppNavigator />
    </Provider>
  )
}
