import React from 'react'
// CSS
import styles from './TodoListView.module.scss'
// antd
import { Checkbox } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

function TodoListView() {

    const todos = [
        { id: '1', title: '화분에 물주기', time: '08:30', checked: true },
        { id: '2', title: '고고 밥주기', time: '09:00', checked: false },
    ]

    const handleRemove = (id) => {
        console.log('remove', id)
    }

    return (
        <div className={styles.todoList}>
            <h3>Today</h3>
            {todos.map(todo => (
                <div key={todo.id} className={styles.todoList__todoItem}>
                    <Checkbox checked={todo.checked}>{`${todo.title} (${todo.time})`}</Checkbox>
                    <CloseOutlined className={styles.todoList__todoItem__closeIcon} onClick={() => handleRemove(todo.id)} />
                </div>
            ))}
        </div>
    )
}

export default TodoListView