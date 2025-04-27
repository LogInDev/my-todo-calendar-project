import { createSlice , createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '@/api/todoApi';

// 1. 서버에서 할일 불러오기
export const loadTodos = createAsyncThunk('todo/loadTodos', async () => {
    const response = await fetchTodos();
    return response.data.data;
});

// 2. 새로운 할일 추가
export const addTodo = createAsyncThunk('todo/addTodo', async (todoData) => {
    const response = await createTodo(todoData);
    return response.data.data;
});

// 3. 기존 할일 수정
export const updateTodoAsync = createAsyncThunk('todo/updateTodo', async ({ id, todoData }) => {
    const response = await updateTodo(id, todoData);
    return response.data.data; 
});

// 4. 기존 할일 삭제
export const removeTodo = createAsyncThunk('todo/removeTodo', async (id) => {
    await deleteTodo(id);
    return id;
});

const todoSlice = createSlice({
    name: 'todo',
    initialState: {
        todoList: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadTodos.fulfilled, (state, action) => {
                state.todoList = action.payload;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.todoList.push(action.payload);
            })
            .addCase(updateTodoAsync.fulfilled, (state, action) => {
                const updatedTodo = action.payload;
                const index = state.todoList.findIndex(todo => todo.id === updatedTodo.id);
                if (index !== -1) {
                    state.todoList[index] = updatedTodo;
                }
            })
            .addCase(removeTodo.fulfilled, (state, action) => {
                state.todoList = state.todoList.filter(todo => todo.id !== action.payload);
            });
    },
});

export default todoSlice.reducer;