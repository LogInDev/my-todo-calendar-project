import React, { useEffect, useState } from 'react'
// Components
import MonthCalendar from './MonthCalendar';
import DayCalendar from './DayCalendar';
import WeekCalendar from './WeekCalendar';
// CSS
import styles from './MiddleSide.module.scss'
// antd
import { Select, Button } from 'antd'
import { UpOutlined, DownOutlined } from '@ant-design/icons';

function MiddleSide({ currentMonth, onTodayClick }) {
    const [viewType, setViewType] = useState('day') // 초기값은 'day'

    const monthOptions = [
        { value: 'day', label: '일' },
        { value: 'week', label: '주' },
        { value: 'month', label: '월' },
    ]

    const renderCalendar = () => {
        switch (viewType) {
            case 'month':
                return <MonthCalendar />
            case 'week':
                return <WeekCalendar />
            case 'day':
            default:
                return <DayCalendar />
        }
    }

    useEffect(() => {
        console.log('현재 선택된 뷰:', viewType)
    }, [viewType])

    return (
        <div>
            {/* middelSide 헤더 */}
            <div className={styles.header}>
                <span className={styles.dateText}>
                    {currentMonth.format('YYYY')} <strong>{currentMonth.format('M월')}</strong>
                </span>
                <div className={styles.controls}>
                    <Select
                        value={viewType}
                        options={monthOptions}
                        onChange={(value) => setViewType(value)}
                    />
                    <Button onClick={onTodayClick}>오늘</Button>
                    <Button
                        type="text"
                        icon={
                            <>
                                <UpOutlined />
                                <DownOutlined />
                            </>
                        }
                    />
                </div>
            </div>
            {/* middleSide 컨텐츠 */}
            <div className={styles.content}>
                {renderCalendar()}
            </div>
        </div>
    )
}

export default MiddleSide