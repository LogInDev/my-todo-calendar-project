import React, { useEffect, useState } from 'react'
import styles from './CurrentTimeLine.module.scss'

function CurrentTimeLine() {
    const [position, setPosition] = useState(0)

    useEffect(() => {
        const update = () => {
            const now = new Date()
            const minutes = now.getHours() * 60 + now.getMinutes()
            const px = (minutes / 60) * 60 // 60px per hour
            setPosition(px)
        }
        update()
        const interval = setInterval(update, 60000)
        return () => clearInterval(interval)
    }, [])

    return <div className={styles.currentLine} style={{ top: `${position}px` }} />
}

export default CurrentTimeLine