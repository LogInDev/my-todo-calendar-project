import React, { useEffect } from 'react'
// redux
import { useDispatch, useSelector } from 'react-redux'
import { openEditPanel } from '@/store/rightPanelSlice'
// CSS
import styles from './TodoItem.module.scss'
import { useDrag } from 'react-dnd'
// dayjs
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
dayjs.extend(minMax)

function TodoItem({ data, date, groupSize = 1, groupIndex = 0 }) {
    const dispatch = useDispatch()
    const { title, startDatetime, endDatetime, tagId, isAllDay } = data

    // tagColor를 Redux 상태에서 가져오기
    const tagColor = useSelector((state) => {
        const tag = state.tag.tagList.find(tag => tag.id === tagId)
        return tag ? tag.color : 'transparent'
    })

    const startTime = dayjs(startDatetime)
    const endTime = dayjs(endDatetime)

    const isMultiDay = !startTime.isSame(endTime, 'day') // 여러 날짜 일정

    // 현재 보여주는 날짜 기준으로 일정 잘라내기
    const currentDayStart = dayjs(date).startOf('day')
    const currentDayEnd = dayjs(date).endOf('day')

    const visibleStart = dayjs.max(startTime, currentDayStart)
    const visibleEnd = dayjs.min(endTime, currentDayEnd)

    const [{ isDragging }, dragRef] = useDrag({
        type: 'TODO',
        item: { ...data },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    // 만약 일정이 이 날짜에 포함되지 않으면 렌더링 X
    if (visibleStart.isAfter(visibleEnd)) return null

    const top = isAllDay ? 0 : visibleStart.diff(currentDayStart, 'minute')
    const duration = isAllDay ? 17 : Math.max(visibleEnd.diff(visibleStart, 'minute'), 15)
    const isCompact = isAllDay || duration <= 15

    // 일정이 같은 시간 라인에 겹치는 경우
    const timeLabelWidth = 58; // 시간 라벨 영역 너비
    const rightPadding = 60;   // MiddleSide 오른쪽 여유 공간
    const totalAvailableWidth = `calc(100% - ${timeLabelWidth + rightPadding}px)`;

    const width = `calc(${totalAvailableWidth} / ${groupSize})`;
    const left = `calc(${timeLabelWidth}px + (${width} * ${groupIndex}))`;

    // todoItem 클릭시 편집모드로 진입
    const handleClick = () => {
        dispatch(openEditPanel(data))
    }


    return (
        <div
            ref={dragRef} // 드래그 연결
            className={`${styles.todo} ${isDragging ? styles.dragging : ''} ${isCompact ? styles.compact : ''}`}
            style={{
                top: isAllDay ? '0px' : `${top + 20}px`,
                height: `${duration}px`,
                opacity: isDragging ? 0.6 : 1,
                cursor: 'move',
                position: 'absolute',
                left,
                width,
                zIndex: isDragging || isAllDay ? 1000 : 2,
                borderLeft: `5px solid ${tagColor}`,
            }}
            onClick={handleClick}
        >
            <div className={styles.title}>{title}</div>
            {!isAllDay && (
                <div className={styles.time}>
                    {isMultiDay
                        ? <>{startTime.format('MM월 DD일 HH:mm')} < br /> → {endTime.format('MM월 DD일 HH:mm')}</>
                        : `${startTime.format('HH:mm')} → ${endTime.format('HH:mm')}`}
                </div>
            )}
        </div>
    )
}

export default TodoItem
