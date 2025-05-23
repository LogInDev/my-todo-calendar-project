import React, { useState, useRef, useEffect } from 'react'
import { groupOverlappingTodos } from '@/utils/todoOverlapUtils'
// redux
import { useDispatch, useSelector } from 'react-redux'
import { openCreatePanel } from '@/store/rightPanelSlice'
import { updateTodoAsync } from '@/store/todoSlice'
// Components
import CurrentTimeLine from './CurrentTimeLine'
import TodoItem from './TodoItem'
import DropCell from '@/components/common/DropCell'
// CSS
import styles from './DayCalendar.module.scss'
// dayjs
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isToday)

function DayCalendar({ date }) {
    const dispatch = useDispatch()
    const isToday = date.isToday()
    const allTodos = useSelector((state) => state.todo.todoList) || [];
    const dayTodos = allTodos.filter(todo => {
        const start = dayjs(todo.startDatetime).tz('Asia/Seoul').startOf('day');
        const end = dayjs(todo.endDatetime).tz('Asia/Seoul').endOf('day');

        // 종일 일정일 경우, startDatetime과 endDatetime을 하루 전체로 설정
        if (todo.isAllDay) {
            return dayjs(date).isBetween(start, end, null, '[)');  // 종일 일정 확인
        }

        // 시간대가 있는 경우 (일반적인 할 일)
        return dayjs(date).isBetween(start, end, null, '[)');  // 시작과 끝 시간 비교
    }) || [];

    // 종일, 일반 분리
    const allDayTodos = dayTodos.filter(todo => todo.isAllDay) || [];
    const timedTodos = dayTodos.filter(todo => !todo.isAllDay)
    // 드래그용 상태
    const [dragStart, setDragStart] = useState(null)
    const [dragEnd, setDragEnd] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isAllDayDrag, setIsAllDayDrag] = useState(false)

    // 그룹화
    const groupedAllDayTodos = groupOverlappingTodos(allDayTodos)
    const groupedTimedTodos = groupOverlappingTodos(timedTodos)

    // 드래그로 할 일 생성
    // 마우스 아래로 드래그
    const handleMouseDown = (hour, minute, isAllDay = false) => {
        const start = isAllDay
            ? dayjs(date).tz('Asia/Seoul').startOf('day')
            : dayjs(date).tz('Asia/Seoul').hour(hour).minute(minute);
        setIsDragging(true)
        setIsAllDayDrag(isAllDay)
        setDragStart(start)
        setDragEnd(start)
    }

    const handleMouseEnter = (hour, minute, isAllDay = false) => {
        if (!isDragging || isAllDay !== isAllDayDrag) return
        const current = isAllDay
            ? dayjs(date).tz('Asia/Seoul').startOf('day')
            : dayjs(date).tz('Asia/Seoul').hour(hour).minute(minute);
        setDragEnd(current)
    }
    // 마우스 위로 드래그
    const handleMouseUp = () => {
        if (dragStart && dragEnd) {
            const start = dragStart.isBefore(dragEnd) ? dragStart : dragEnd
            const endRaw = dragStart.isAfter(dragEnd) ? dragStart.clone() : dragEnd.clone()

            const minuteDiff = Math.abs(start.diff(endRaw, 'minute'))
            const end = minuteDiff < 5
                ? start.clone().add(15, 'minute')
                : endRaw.clone().add(15, 'minute')

            dispatch(openCreatePanel({
                id: null,
                title: '',
                startDatetime: start.format(),
                endDatetime: isAllDayDrag ? start.endOf('day').format() : end.format(),
                isAllDay: isAllDayDrag,
                tagId: null,
                completed: false,
            }))
        }

        setIsDragging(false)
        setIsAllDayDrag(false)
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
            ? dayjs(date).tz('Asia/Seoul').startOf('day')
            : dayjs(date).tz('Asia/Seoul').hour(hour).minute(minute);
        const duration = dayjs(item.endDatetime).diff(dayjs(item.startDatetime), 'minute')
        const newEnd = newStart.add(duration, 'minute')

        dispatch(updateTodoAsync({
            id: item.id,
            todoData: {
                title: item.title,
                startDatetime: newStart.format(),
                endDatetime: newEnd.format(),
                isAllDay,
                tagId: item.tagId,
                completed: item.completed,
            },
        }));
    }

    return (
        <div className={styles.wrapper} onMouseUp={handleMouseUp}>
            {/* 날짜 헤더 */}
            <div className={styles.dateHeader}>
                <span>{date.format('ddd')}</span>
                <span className={`${styles.dateHeader__dateBox} ${isToday ? styles.dateHeader__today : styles.dateHeader__notToday}`}>{date.date()}</span>
            </div>

            {/* 일 캘린더 */}
            <div className={styles.timeGrid} >
                {/* 종일 영역 */}
                <div className={styles.allDayRow}>
                    <span className={styles.allDayRow__label}>종일</span>
                    <DropCell
                        isAllDay
                        hour={0}
                        minute={0}
                        onDrop={handleDrop}
                        onMouseDown={() => handleMouseDown(0, 0, true)}
                        onMouseEnter={() => handleMouseEnter(0, 0, true)}
                        isInRange={isDragging && isAllDayDrag}
                    />
                    {/* 종일 할 일 렌더링 */}
                    {groupedAllDayTodos.map((group) =>
                        group.map((todo, indexInGroup) => (
                            <TodoItem
                                key={todo.id}
                                data={todo}
                                date={date}
                                groupSize={group.length}
                                groupIndex={indexInGroup}
                                isAllDay={true}
                            />
                        ))
                    )}
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
                                    onMouseDown={() => handleMouseDown(hour, minute)}
                                    onMouseEnter={() => handleMouseEnter(hour, minute)}
                                    isInRange={isDragging && isCellInRange(hour, minute)}
                                />
                            ))}
                        </div>
                    </div>
                ))}


                {/* 할 일 목록 렌더링 */}
                {groupedTimedTodos.map((group, groupIndex) => (
                    group.map((todo, indexInGroup) => (
                        <TodoItem
                            key={todo.id}
                            data={todo}
                            date={date}
                            groupSize={group.length}    // 겹치는 할일 수
                            groupIndex={indexInGroup}   // 몇 번째 column인지
                        />
                    ))
                ))}
            </div>
        </div>
    )
}

export default DayCalendar