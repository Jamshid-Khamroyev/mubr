import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  load: false,
  link: "https://quiz-arena-for-school-backend.onrender.com"
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