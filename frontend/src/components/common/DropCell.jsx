import React from 'react'
// CSS
import styles from './DropCell.module.scss'
import { useDrop } from 'react-dnd'

function DropCell({ hour,
    minute,
    isAllDay = false,
    isInRange = false,
    onClick,
    onDrop,
    onMouseDown,
    onMouseEnter, }) {

    const [{ isOver }, dropRef] = useDrop({
        accept: 'TODO',
        drop: (item) => {
            if (onDrop) {
                onDrop(item, hour, minute, isAllDay)
            }
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
            className={[
                styles.cell,
                isAllDay && styles.allDay,
                isOver && styles.isOver,
                isInRange && styles.isInRange,
            ]
                .filter(Boolean)
                .join(' ')}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
        />
    )
}

export default DropCell
