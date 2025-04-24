import React, { useEffect } from 'react'
import styles from './TodoItem.module.scss'
import { useDrag } from 'react-dnd'

function TodoItem({ data }) {
    const { title, start, end, color, isAllDay } = data

    const top = isAllDay ? 0 : start.hour() * 60 + start.minute()
    const rawDuration = end.diff(start, 'minute')
    const duration = isAllDay ? 20 : Math.max(rawDuration, 15)
    const isCompact = isAllDay || duration <= 15


    const [{ isDragging }, dragRef] = useDrag({
        type: 'TODO',
        item: { ...data },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })


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
                position: 'absolute', // 절대 위치 필수
                left: 60, // 필요시 조정 (좌측 라벨과 겹치지 않게)
                right: 0,
                zIndex: isDragging || isAllDay ? 1000 : 2,
            }}
        >
            <div className={styles.title}>{data.title}</div>
            {!isAllDay && (
                <div className={styles.time}>
                    {`${start.format('HH:mm')} - ${end.format('HH:mm')}`}
                </div>
            )}
        </div >
    )
}

export default TodoItem
