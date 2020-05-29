import React from 'react'
import { Provider } from 'react-redux'
import AppNavigator from './AppNavigator'

import { store } from './store'

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  )
}
