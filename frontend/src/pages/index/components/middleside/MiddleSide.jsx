import React from 'react'
// CSS
import styles from './MiddleSide.module.scss'
// antd
import { ScheduleOutlined } from '@ant-design/icons';

function MiddleSide({ currentMonth }) {
    return (
        <div>
            {/* middelSide 헤더 */}
            <div className={styles.header}>
                <span>{currentMonth.format('YYYY M월')}</span>
            </div>
        </div>
    )
}

export default MiddleSide