import apiClient from '@/api/apiClient';

export const fetchTodos = () => apiClient.get('/api/todos');

export const createTodo = (todoData) => apiClient.post('/api/todos', todoData);

export const updateTodo = (id, todoData) => apiClient.patch(`/api/todos/${id}`, todoData);

export const deleteTodo = (id) => apiClient.delete(`/api/todos/${id}`);