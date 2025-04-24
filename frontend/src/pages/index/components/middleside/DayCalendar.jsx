import React, { useState } from 'react'
// redux
import { useDispatch, useSelector } from 'react-redux'
import { openCreatePanel, closePanel } from '@/store/rightPanelSlice'
import { addTodo, updateTodo } from '@/store/todoSlice'
// Components
import CurrentTimeLine from './CurrentTimeLine'
import TodoItem from './TodoItem'
import DropCell from '@/components/common/DropCell'
// CSS
import styles from './DayCalendar.module.scss'
// dayjs
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
dayjs.extend(isToday)

function DayCalendar({ date }) {
    const dispatch = useDispatch()
    const isToday = date.isToday()

    const allTodos = useSelector((state) => state.todo.todos)
    const todos = allTodos.filter((todo) => dayjs(todo.start).isSame(date, 'day'))

    const [dragStart, setDragStart] = useState(null)
    const [dragEnd, setDragEnd] = useState(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleCellClick = () => {
        dispatch(closePanel()) // 빈 셀 클릭 시 우측 패널 닫기
    }

    const handleMouseDown = (hour, minute) => {
        const start = dayjs(date).hour(hour).minute(minute);
        setIsDragging(true);
        setDragStart(start);
        setDragEnd(start);
    }

    const handleMouseEnter = (hour, minute) => {
        if (!isDragging) return;
        const current = dayjs(date).hour(hour).minute(minute);
        setDragEnd(current);
    }

    const handleMouseUp = () => {
        if (dragStart && dragEnd) {
            const start = dragStart.isBefore(dragEnd) ? dragStart : dragEnd
            const end = dragStart.isAfter(dragEnd) ? dragStart : dragEnd

            dispatch(openCreatePanel({
                title: '',
                start: start.toISOString(),
                end: end.add(15, 'minute').toISOString(),
                isAllDay: false,
            }))
        }

        setIsDragging(false)
        setDragStart(null)
        setDragEnd(null)
    }

    const isCellInRange = (hour, minute) => {
        if (!dragStart || !dragEnd) return false
        const cell = dayjs(date).hour(hour).minute(minute)
        const start = dragStart.isBefore(dragEnd) ? dragStart : dragEnd
        const end = dragStart.isAfter(dragEnd) ? dragStart : dragEnd

        return (
            cell.isSame(start) ||
            cell.isSame(end) ||
            (cell.isAfter(start) && cell.isBefore(end))
        )
    }

    const handleDrop = (item, hour, minute, isAllDay = false) => {
        const newStart = isAllDay
            ? dayjs(date).startOf('day')
            : dayjs(date).hour(hour).minute(minute)
        const duration = dayjs(item.end).diff(dayjs(item.start), 'minute')
        const newEnd = newStart.add(duration, 'minute')

        console.log('[Drop: updateTodo]', item.id, newStart.format(), newEnd.format())
        dispatch(updateTodo({
            ...item,
            start: newStart.toISOString(),
            end: newEnd.toISOString(),
            isAllDay,
        }))

    }

    return (
        <div className={styles.wrapper} onMouseUp={handleMouseUp}>
            {/* 날짜 헤더 */}
            <div className={styles.dateHeader}>
                <span>{date.format('ddd')}</span>
                <span className={`${styles.dateHeader__dateBox} ${isToday ? styles.dateHeader__today : styles.dateHeader__notToday}`}>{date.date()}</span>
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
                        onDrop={handleDrop}
                        onClick={handleCellClick}
                    />
                </div>

                {/* 현재 시간 표시 라인 */}
                {isToday && <CurrentTimeLine />}

                {/* 시간 그리드 */}
                {[...Array(24)].map((_, hour) => (
                    <div key={hour} className={styles.hourRow}>
                        <span className={styles.hourRow__label}>{hour !== 0 ? `${hour}:00` : ''}</span>
                        <div className={styles.hourRow__column}>
                            {[0, 15, 30, 45].map((minute) => (
                                <DropCell
                                    key={`${hour}-${minute}`}
                                    hour={hour}
                                    minute={minute}
                                    onDrop={handleDrop}
                                    onClick={() => handleCellClick(hour, minute)}
                                    onMouseDown={() => handleMouseDown(hour, minute)}
                                    onMouseEnter={() => handleMouseEnter(hour, minute)}
                                    isInRange={isDragging && isCellInRange(hour, minute)}
                                />
                            ))}
                        </div>
                    </div>
                ))}


                {/* 할 일 목록 렌더링*/}
                {todos.map((todo) => (
                    <TodoItem key={todo.id} data={todo} />
                ))}
            </div>
        </div>
    )
}

export default DayCalendar