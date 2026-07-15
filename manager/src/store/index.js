import { configureStore } from '@reduxjs/toolkit'
import user from '../reducers/user'
import load from '../reducers/load'

export const store = configureStore({
  reducer: {
    user: user,
    load: load
  },
})