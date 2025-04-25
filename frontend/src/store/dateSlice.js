import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

const dateSlice = createSlice({
  name: 'date',
  initialState: {
    selectedDate: dayjs().format(), // default는 오늘 날짜
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    },
  },
})

export const { setSelectedDate } = dateSlice.actions
export default dateSlice.reducer
