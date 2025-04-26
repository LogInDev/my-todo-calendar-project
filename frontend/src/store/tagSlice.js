import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTags, createTag, deleteTag } from '@/api/tagApi';
import { getRandomColor } from '@/utils/colorUtils'

export const loadTags = createAsyncThunk('tag/loadTags', async () => {
  const response = await fetchTags();
  return response.data;
});

export const addTag = createAsyncThunk('tag/addTag', async (tagData) => {
  const response = await createTag(tagData);
  return response.data;
});

export const removeTag = createAsyncThunk('tag/removeTag', async (tagId) => {
  await deleteTag(tagId);
  return tagId;
});

const tagSlice = createSlice({
  name: 'tag',
  initialState:{
    tagList: [],
  },
  reducers: {
    // 동기적으로 태그 리스트에 추가 (필요 시)
    addTagSync: (state, action) => {
      state.tagList.push(action.payload);
    },
    updateTagName: (state, action) => {
      const { id, name } = action.payload;
      const tag = state.tagList.find(tag => tag.id === id);
      if (tag) tag.name = name;
    },
    updateTagColor: (state, action) => {
      const { id, color } = action.payload;
      const tag = state.tagList.find(tag => tag.id === id);
      if (tag) tag.color = color;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTags.fulfilled, (state, action) => {
        state.tagList = action.payload;
      })
      .addCase(addTag.fulfilled, (state, action) => {
        state.tagList.push(action.payload);
      })
      .addCase(removeTag.fulfilled, (state, action) => {
        state.tagList = state.tagList.filter(tag => tag.id !== action.payload);
      });
  },
});

export const { addTagSync, updateTagName, updateTagColor } = tagSlice.actions;
export default tagSlice.reducer;