import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTags, createTag, deleteTag, updateTag } from '@/api/tagApi';

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

export const updateTagAsync = createAsyncThunk(
  'tag/updateTag',
  async ({ id, name, color }) => {
    const response = await updateTag(id, { name, color });
    return response.data;
  }
);


const tagSlice = createSlice({
  name: 'tag',
  initialState:{
    tagList: [],
  },
  reducers: {},
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
      })
      .addCase(updateTagAsync.fulfilled, (state, action) => {
        const updatedTag = action.payload;
        const tag = state.tagList.find(tag => tag.id === updatedTag.id);
        if (tag) {
          tag.name = updatedTag.name;
          tag.color = updatedTag.color;
        }
      });
  },
});

export default tagSlice.reducer;