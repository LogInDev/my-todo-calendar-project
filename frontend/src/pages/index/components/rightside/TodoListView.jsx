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

function TodoListView() {
    const dispatch = useDispatch();
    const todoList = useSelector((state) => state.todo.todoList);

    useEffect(() => {
        dispatch(loadTodos());
    }, [dispatch]);

    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');

    // 오늘/내일 기준으로 필터링
    const todayTodos = todoList.filter(todo => dayjs(todo.startDatetime).format('YYYY-MM-DD') === today);
    const tomorrowTodos = todoList.filter(todo => dayjs(todo.startDatetime).format('YYYY-MM-DD') === tomorrow);

    const handleToggleCompleted = (todo) => {
        dispatch(updateTodoAsync({
            id: todo.id,
            todoData: { completed: !todo.completed }
        }))
    };

    const handleRemove = (id) => {
        if (window.confirm('정말 삭제할까요?')) {
            dispatch(removeTodo(id))
        }
    };

    const renderTodoList = (todos) => (
        todos.map(todo => (
            <div key={todo.id} className={styles.todoList__todoItem}>
                <Checkbox
                    checked={todo.completed}
                    onChange={() => handleToggleCompleted(todo)}
                >
                    {`${todo.title} (${dayjs(todo.startDatetime).format('HH:mm')})`}
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

            {/* 내일 할일 */}
            <h3>Tomorrow</h3>
            {tomorrowTodos.length > 0 ? renderTodoList(tomorrowTodos) : <p>내일 할일이 없습니다.</p>}
        </div>
    );
}

export default TodoListView;
