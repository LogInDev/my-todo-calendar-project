import React from 'react'
import { useSelector } from 'react-redux'
// Components
import TodoListView from './TodoListView'
import TodoEditView from './TodoEditView'
// CSS
import styles from './RightSide.module.scss'

function RightSide() {
    const mode = useSelector((state) => state.rightPanel.mode) // 'list' | 'edit' | 'create'
    const selectedTodo = useSelector((state) => state.rightPanel.todo)

    if (mode === 'edit' || mode === 'create') {
        return <TodoEditView todo={selectedTodo} />
    }

    return <TodoListView />
}

export default RightSide
