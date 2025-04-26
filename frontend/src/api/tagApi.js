import apiClient from '@/api/apiClient';

export const fetchTags = () => {
  return apiClient.get('/api/tags');
};

export const createTag = (tagData) => {
  return apiClient.post('/api/tags', tagData);
};

export const deleteTag = (tagId) => {
  return apiClient.delete(`/api/tags/${tagId}`);
};
