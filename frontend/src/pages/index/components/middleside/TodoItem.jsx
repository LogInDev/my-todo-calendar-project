import React from 'react'
import styles from './TodoItem.module.scss'
import { useDrag } from 'react-dnd'

function TodoItem({ data }) {
    const top = data.start.hour() * 60 + data.start.minute()
    const height = data.end.diff(data.start, 'minute')

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
            className={styles.todo}
            style={{
                top: `${top}px`,
                height: `${height}px`,
                backgroundColor: data.color,
                opacity: isDragging ? 0.6 : 1,
                cursor: 'move',
                position: 'absolute', // 절대 위치 필수
                left: 60, // 필요시 조정 (좌측 라벨과 겹치지 않게)
                right: 0,
                zIndex: isDragging ? 1000 : 1,
            }}
        >
            <div className={styles.title}>{data.title}</div>
            <div className={styles.time}>
                {data.start.format('HH:mm')} - {data.end.format('HH:mm')}
            </div>
        </div>
    )
}

export default TodoItem
