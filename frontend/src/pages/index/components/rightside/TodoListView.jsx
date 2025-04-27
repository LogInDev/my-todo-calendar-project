import React, { useEffect } from 'react';
// CSS
import styles from './TodoListView.module.scss';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { loadTodos, updateTodoAsync, removeTodo } from '@/store/todoSlice';
// antd
import { Checkbox } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

function TodoListView() {
    const dispatch = useDispatch();
    const todoList = useSelector((state) => state.todo.todoList);

    useEffect(() => {
        dispatch(loadTodos());
    }, [dispatch]);

    // 오늘/내일 기준으로 필터링
    const todayTodos = todoList.filter(todo => {
        const start = dayjs(todo.startDatetime).startOf('day');
        const end = dayjs(todo.endDatetime).endOf('day');
        const now = dayjs().startOf('day');
        return now.isBetween(start, end, null, '[]');
    });

    const handleToggleCompleted = (todo) => {
        dispatch(updateTodoAsync({
            id: todo.id,
            todoData: {
                title: todo.title,
                startDatetime: dayjs(todo.startDatetime).format(),
                endDatetime: dayjs(todo.endDatetime).format(),
                isAllDay: todo.isAllDay,
                tagId: todo.tagId,
                completed: !todo.completed
            }
        }))
    };

    const handleRemove = (id) => {
        if (window.confirm('정말 삭제할까요?')) {
            dispatch(removeTodo(id))
        }
    };

    const renderTodoList = (todos) => (
        todos.map(todo => (
            <div key={todo.id}
                className={styles.todoList__todoItem}
            >
                <Checkbox
                    checked={todo.completed}
                    onChange={() => handleToggleCompleted(todo)}
                >
                    <span className={`${todo.completed ? styles.completed : ''}`}>{todo.title}</span>
                    <div className={`${styles.todoList__todoItem__todoDate} ${todo.completed ? styles.completed : ''}`}>
                        {dayjs(todo.startDatetime).format('MM-DD HH:mm')}
                        → {dayjs(todo.endDatetime).format('MM-DD HH:mm')}
                    </div>
                </Checkbox>
                <CloseOutlined
                    className={styles.todoList__todoItem__closeIcon}
                    onClick={() => handleRemove(todo.id)}
                />
            </div>
        ))
    );

    return (
        <div className={styles.todoList}>
            {/* 오늘 할일 */}
            <h3>Today</h3>
            {todayTodos.length > 0 ? renderTodoList(todayTodos) : <p>오늘 할일이 없습니다.</p>}
        </div>
    );
}

export default TodoListView;
