import apiClient from '@/api/apiClient';

export const fetchTags = () => apiClient.get('/api/tags');


export const createTag = (tagData) => apiClient.post('/api/tags', tagData);


export const deleteTag = (tagId) => apiClient.delete(`/api/tags/${tagId}`);


export const updateTag = (tagId, updateData) => apiClient.patch(`/api/tags/${tagId}`, updateData);