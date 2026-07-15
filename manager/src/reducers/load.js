import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  load: false,
}

export const counterSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    showLoad: (state) => {
      state.load = true
    },
    hideLoad: (state) => {
      state.load = false
    }
  },
})

export const { showLoad, hideLoad } = counterSlice.actions

export default counterSlice.reducer