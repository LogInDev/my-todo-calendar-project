import { createSlice } from '@reduxjs/toolkit'
import { getRandomColor } from '@/utils/colorUtils'

const tagSlice = createSlice({
  name: 'tag',
  initialState:{
    tagList: [],
  },
  reducers: {
    addTag: (state, action) => {
      state.tagList.push(action.payload)
    },
    updateTagName: (state, action) => {
      const { id, name } = action.payload
      const tag = state.tagList.find(tag => tag.id === id)
      if (tag) tag.name = name
    },
    updateTagColor: (state, action) => {
      const { id, color } = action.payload
      const tag = state.tagList.find(tag => tag.id === id)
      if (tag) tag.color = color
    },
    removeTag: (state, action) => {
      state.tagList = state.tagList.filter(tag => tag.id !== action.payload)
      // 삭제 후 아무 태그도 없으면 New Tag 자동 생성
      if (state.tagList.length === 0) {
        state.tagList.push({
          id: 'default',
          name: 'New Tag',
          color: getRandomColor(),
        })
      }
    },
    ensureDefaultTag: (state) => {
      if (state.tagList.length === 0) {
        state.tagList.push({
          id: 'default',
          name: 'New Tag',
          color: getRandomColor(),
        })
      }
    },
  },
})

export const { addTag, ensureDefaultTag, updateTagName, updateTagColor, removeTag } = tagSlice.actions
export default tagSlice.reducer
