import React, { useState } from 'react'
// redux
import { useSelector } from 'react-redux'
// Components
import CurrentTimeLine from './CurrentTimeLine'
import TodoItem from './TodoItem'
// CSS
import styles from './DayCalendar.module.scss'
// dayjs
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import DropCell from '@/components/common/DropCell'
dayjs.extend(isToday)

function DayCalendar({ date }) {
    const isToday = date.isToday()

    // 선택된 날짜에 따라 todos 상태를 업데이트
    const [todos, setTodos] = useState([
        {
            id: '1',
            title: '세브란스 예약',
            start: dayjs(date).hour(15).minute(50),
            end: dayjs(date).hour(16).minute(50),
            color: '#e6f4ff',
        },
    ])

    // drop하는 곳의 정보를 todoItem에 업데이트
    const updateTodoTime = (todo, newHour, newMinute) => {
        setTodos((prev) =>
            prev.map((t) => {
                if (t.id === todo.id) {
                    const duration = dayjs(t.end).diff(t.start, 'minute')
                    const newStart = dayjs(date).hour(newHour).minute(newMinute)
                    const newEnd = newStart.add(duration, 'minute')
                    return { ...t, start: newStart, end: newEnd }
                }
                return t
            })
        )
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.dateHeader}>
                <span>{date.format('dddd')}</span>
                <span className={`${styles.dateBox} ${isToday ? styles.today : styles.notToday}`}>
                    {date.date()}
                </span>
            </div>

            <div className={styles.timeGrid}>
                {isToday && <CurrentTimeLine />}

                {[...Array(24)].map((_, hour) => (
                    <div key={hour} className={styles.timeGrid__hourRow}>
                        <span className={styles.timeGrid__hourLabel}>{hour}:00</span>
                        <div className={styles.timeGrid__column}>
                            {[0, 15, 30, 45].map((minute) => (
                                <DropCell
                                    key={`${hour}-${minute}`}
                                    hour={hour}
                                    minute={minute}
                                    onDrop={updateTodoTime}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {todos.map((todo) => (
                    <TodoItem key={todo.id} data={todo} />
                ))}
            </div>
        </div>
    )
}

export default DayCalendar