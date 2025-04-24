import React, { useState } from 'react'
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
            start: dayjs(date).hour(1).minute(50),
            end: dayjs(date).hour(1).minute(50),
            color: '#e6f4ff',
            isAllDay: false,  // 종일 여부
        },
    ])

    // drop하는 곳의 정보를 todoItem에 업데이트
    const updateTodoTime = (todo, newHour, newMinute, isAllDayDrop = false) => {
        const newStart = isAllDayDrop
            ? dayjs(date).startOf('day')       // 종일이면 시간 없이 날짜만
            : dayjs(date).hour(newHour).minute(newMinute)

        const duration = dayjs(todo.end).diff(dayjs(todo.start), 'minute')

        const newEnd = isAllDayDrop
            ? newStart.add(15, 'minute')       // 종일 높이용
            : newStart.add(duration, 'minute')

        setTodos((prev) =>
            prev.map((t) =>
                t.id === todo.id
                    ? {
                        ...t,
                        start: newStart,
                        end: newEnd,
                        isAllDay: isAllDayDrop,
                    }
                    : t
            )
        )
    }

    return (
        <div className={styles.wrapper}>
            {/* 날짜 헤더 */}
            <div className={styles.dateHeader}>
                <span>{date.format('ddd')}</span>
                <span className={`${styles.dateHeader__dateBox} ${isToday ? styles.dateHeader__today : styles.dateHeader__notToday}`}>
                    {date.date()}
                </span>
            </div>

            {/* 일 캘린더 */}
            <div className={styles.timeGrid}>
                {/* 종일 영역 */}
                <div className={styles.allDayRow}>
                    <span className={styles.allDayRow__label}>종일</span>
                    <DropCell
                        isAllDay
                        hour={0}
                        minute={0}
                        onDrop={updateTodoTime}
                    />
                </div>

                {/* 현재 시간 표시 라인 */}
                {isToday && <CurrentTimeLine />}

                {/* 시간 그리드 */}
                {[...Array(24)].map((_, hour) => (
                    <div key={hour} className={styles.hourRow}>
                        <span className={styles.hourRow__label}>
                            {hour !== 0 ? `${hour}:00` : ''}
                        </span>
                        <div className={styles.hourRow__column}>
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

                {/* 할 일 */}
                {todos.map((todo) => (
                    <TodoItem key={todo.id} data={todo} />
                ))}
            </div>
        </div>
    )
}

export default DayCalendar