import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload
    },
    logoutUser: (state) => {
      state.user = null
    }
  },
})

export const { loginUser, logoutUser } = counterSlice.actions

export default counterSlice.reducer