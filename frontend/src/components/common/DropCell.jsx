import React from 'react'
import { useDrop } from 'react-dnd'
// CSS
import styles from './DropCell.module.scss'

function DropCell({ hour, minute, onDrop, isAllDay = false }) {
    const [{ isOver }, dropRef] = useDrop({
        accept: 'TODO',
        drop: (item) => {
            onDrop(item, hour, minute, isAllDay)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    })

    return (
        <div
            ref={dropRef}
            className={`${styles.cell} ${isAllDay ? styles.allDay : ''} ${isOver ? styles.isOver : ''}`}
        />
    )
}

export default DropCell
