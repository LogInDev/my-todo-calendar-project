import { configureStore } from '@reduxjs/toolkit'
import dateReducer from './dateSlice'
import rightPanelReducer from './rightPanelSlice'
import todoReducer from './todoSlice'
import tagReducer from './tagSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    date: dateReducer,
    rightPanel: rightPanelReducer,
    todo: todoReducer,
    tag: tagReducer,
    user: userReducer,
  },
})

// 2. window.store 등록
if (process.env.NODE_ENV === 'development') {
  window.store = store
}

export default store