import { configureStore } from '@reduxjs/toolkit'
import dateReducer from './dateSlice'
import rightPanelReducer from './rightPanelSlice'

export default configureStore({
  reducer: {
    date: dateReducer, // 선택된 날짜를 관리하는 리듀서
    rightPanel: rightPanelReducer, // 오른쪽 패널의 상태를 관리하는 리듀서
  },
})
