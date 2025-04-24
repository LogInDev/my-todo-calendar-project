import React, { useEffect } from 'react'
// redux
import { useDispatch } from 'react-redux'
import { openEditPanel } from '@/store/rightPanelSlice'
// CSS
import styles from './TodoItem.module.scss'
import { useDrag } from 'react-dnd'
// dayjs
import dayjs from 'dayjs'

function TodoItem({ data }) {
    const dispatch = useDispatch()
    const { title, start, end, color, isAllDay } = data

    const startTime = dayjs(start)
    const endTime = dayjs(end)

    const top = isAllDay ? 0 : startTime.hour() * 60 + startTime.minute()
    const rawDuration = endTime.diff(startTime, 'minute')
    const duration = isAllDay ? 20 : Math.max(rawDuration, 15)
    const isCompact = isAllDay || duration <= 15

    const [{ isDragging }, dragRef] = useDrag({
        type: 'TODO',
        item: { ...data },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    // todoItem 클릭시 편집모드로 진입
    const handleClick = () => {
        dispatch(openEditPanel(data))
    }

    useEffect(() => {
        console.log('[Drag start]', data.id, data.title)
    }, [data])

    return (
        <div
            ref={dragRef} // 드래그 연결
            className={`${styles.todo} ${isDragging ? styles.dragging : ''} ${isCompact ? styles.compact : ''}`}
            style={{
                top: isAllDay ? '0px' : `${top + 23}px`,
                height: `${duration}px`,
                backgroundColor: color,
                opacity: isDragging ? 0.6 : 1,
                cursor: 'move',
                position: 'absolute',
                left: 60,
                right: 0,
                zIndex: isDragging || isAllDay ? 1000 : 2,
            }}
            onClick={handleClick}
        >
            <div className={styles.title}>{title}</div>
            {!isAllDay && (
                <div className={styles.time}>
                    {`${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`}
                </div>
            )}
        </div>
    )
}

export default TodoItem
