import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    LoginUser: (state, action) => {
      state.user = action.payload
    },
    Logout: (state) => {
      state.user = null
    }
  },
})

export const { LoginUser, Logout } = counterSlice.actions

export default counterSlice.reducer