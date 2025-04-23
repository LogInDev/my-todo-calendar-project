import React from 'react'
import styles from './TodoItem.module.scss'

function TodoItem({ data }) {
    const top = data.start.hour() * 60 + data.start.minute()
    const height = data.end.diff(data.start, 'minute')

    return (
        <div
            className={styles.todo}
            style={{
                top: `${top}px`,
                height: `${height}px`,
                backgroundColor: data.color,
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
