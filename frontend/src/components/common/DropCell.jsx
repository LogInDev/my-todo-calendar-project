import React from 'react'
// CSS
import styles from './DropCell.module.scss'
import { useDrop } from 'react-dnd'

function DropCell({ hour, minute, onDrop, isAllDay = false, onClick }) {

    const [{ isOver }, dropRef] = useDrop({
        accept: 'TODO',
        drop: (item) => {
            onDrop(item, hour, minute, isAllDay)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    })

    const handleClick = () => {
        if (onClick) {
            onClick(hour, minute, isAllDay)
        }
    }

    return (
        <div
            ref={dropRef}
            className={`${styles.cell} ${isAllDay ? styles.allDay : ''} ${isOver ? styles.isOver : ''}`}
            onClick={handleClick}
        />
    )
}

export default DropCell
