import React from 'react'
// CSS
import styles from './MiddleSide.module.scss'
// antd
import { ScheduleOutlined } from '@ant-design/icons';

function MiddleSide({ currentMonth }) {
    return (
        <div>
            <ScheduleOutlined />{currentMonth.format('YYYY MM월')}
        </div>
    )
}

export default MiddleSide