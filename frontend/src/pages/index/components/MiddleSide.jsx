import React from 'react'
import styles from './MiddleSide.module.scss'

function MiddleSide({ currentMonth }) {
    return (
        <div>
            <h2>{currentMonth.format('YYYY MM월')}</h2>
        </div>
    )
}

export default MiddleSide