import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTags, createTag, deleteTag, updateTag } from '@/api/tagApi';

// 1. 태그 전체 불러오기
export const loadTags = createAsyncThunk('tag/loadTags', async (_, { dispatch }) => {
  const response = await fetchTags();
  const tagList = response.data.data;

  if (tagList.length === 0) {
    const newTag = {
      name: 'New Tag',
      color: '#4096ff',
    };
    const createResponse = await createTag(newTag);
    return [createResponse.data.data];  
  }

  return tagList;
});

// 2. 새 태그 추가
export const addTag = createAsyncThunk('tag/addTag', async (tagData) => {
  const response = await createTag(tagData);
  return response.data.data;
});

// 3. 태그 삭제
export const removeTag = createAsyncThunk('tag/removeTag', async (tagId) => {
  await deleteTag(tagId);
  return tagId;
});

// 4. 태그 수정
export const updateTagAsync = createAsyncThunk(
  'tag/updateTag',
  async ({ id, name, color }) => {
    const response = await updateTag(id, { name, color });
    return response.data.data;
  }
);

const tagSlice = createSlice({
  name: 'tag',
  initialState: {
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
