import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  todos: [],
}

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.todos.push(action.payload)
    },
    updateTodo: (state, action) => {
      const updated = action.payload;
      const index = state.todos.findIndex((t) => t.id === updated.id);
      if (index !== -1) {
        state.todos[index] = { ...updated }; 
      }
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter(t => t.id !== action.payload)
    },
  },
})

export const { addTodo, updateTodo, deleteTodo } = todoSlice.actions
export default todoSlice.reducer
