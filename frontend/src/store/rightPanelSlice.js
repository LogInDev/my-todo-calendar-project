import { createSlice } from '@reduxjs/toolkit'

const rightPanelSlice = createSlice({
  name: 'rightPanel',
  initialState :{
    mode: 'list',   // 'list' | 'edit' | 'create'
    todo: null,     // 선택된 할일 정보 or 생성할 일정의 시간 정보
  },
  reducers: {
    openEditPanel: (state, action) => {
      state.mode = 'edit'
      state.todo = action.payload // 기존 일정 객체
    },
    openCreatePanel: (state, action) => {
      state.mode = 'create'
      state.todo = action.payload // { start: dayjsObj, end: dayjsObj }
    },
    closePanel: (state) => {
      state.mode = 'list'
      state.todo = null
    },
  },
})

export const { openEditPanel, openCreatePanel, closePanel } = rightPanelSlice.actions
export default rightPanelSlice.reducer
