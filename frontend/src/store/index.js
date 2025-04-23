import { configureStore } from '@reduxjs/toolkit'
import dateReducer from './dateSlice'

export default configureStore({
  reducer: {
    date: dateReducer, // 선택된 날짜를 관리하는 리듀서
  },
})
