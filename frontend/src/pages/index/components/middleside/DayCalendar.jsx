import React, { useState, useEffect } from 'react'
// redux
import { useSelector, useDispatch } from 'react-redux'
import { setDate } from '@/store/dateSlice'
// Components
import CurrentTimeLine from './CurrentTimeLine'
import TodoItem from './TodoItem'
// CSS
import styles from './DayCalendar.module.scss'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
dayjs.extend(isToday)

function DayCalendar() {
    const dispatch = useDispatch()
    const selectedDate = useSelector((state) => state.date.selectedDate)

    const [todos, setTodos] = useState([
        {
            id: '1',
            title: '세브란스 예약',
            start: dayjs(selectedDate).hour(15).minute(50),
            end: dayjs(selectedDate).hour(16).minute(50),
            color: '#e6f4ff',
        },
    ])

    const isToday = selectedDate.isToday()

    return (
        <div className={styles.wrapper}>
            <div className={styles.dateHeader}>
                <span>{selectedDate.format('dddd')}</span>
                <span
                    className={`${styles.dateBox} ${isToday ? styles.today : styles.notToday
                        }`}
                >
                    {selectedDate.date()}
                </span>
            </div>

            <div className={styles.timeGrid}>
                {isToday && <CurrentTimeLine />}

                {[...Array(24)].map((_, hour) => (
                    <div key={hour} className={styles.timeGrid__timeSlot}>
                        <div className={styles.timeGrid__hourRow}>
                            <span className={styles.timeGrid__hourLabel}>{hour}:00</span>
                            <div className={styles.timeGrid__line}></div>
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