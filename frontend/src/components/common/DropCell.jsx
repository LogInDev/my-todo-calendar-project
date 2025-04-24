import React from 'react'
import { useDrop } from 'react-dnd'
// CSS
import styles from './DropCell.module.scss'

function DropCell({ hour, minute, onDrop }) {
    const [{ isOver }, dropRef] = useDrop({
        accept: 'TODO',
        drop: (item) => {
            console.log('[DropCell] dropped', item, hour, minute)
            onDrop(item, hour, minute)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    })

    return (
        <div
            ref={dropRef}
            className={`${styles.cell} ${isOver ? styles.isOver : ''}`}
        >
            {/* optional 시각적 표시 */}
        </div>
    )
}

export default DropCell
