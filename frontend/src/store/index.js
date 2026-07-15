import { configureStore } from '@reduxjs/toolkit'
import userReducers from '../reducers/user'
import loadReducer from '../reducers/load'

export const store = configureStore({
  reducer: {
    user: userReducers,
    load: loadReducer,
  },
})