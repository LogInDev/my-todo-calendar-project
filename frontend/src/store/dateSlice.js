import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

const dateSlice = createSlice({
  name: 'date',
  initialState: {
    selectedDate: dayjs(), // default는 오늘 날짜
  },
  reducers: {
    setDate: (state, action) => {
      state.selectedDate = action.payload
    },
  },
})

export const { setDate } = dateSlice.actions
export default dateSlice.reducer
