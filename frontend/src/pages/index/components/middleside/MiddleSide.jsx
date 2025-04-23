import React, { useEffect, useState } from 'react'
// redux
import { useSelector, useDispatch } from 'react-redux';
import { setDate } from '@/store/dateSlice';
// Components
import MonthCalendar from './MonthCalendar';
import DayCalendar from './DayCalendar';
import WeekCalendar from './WeekCalendar';
// CSS
import styles from './MiddleSide.module.scss'
// antd
import { Select, Button } from 'antd'
import { UpOutlined, DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
// dayjs
import dayjs from 'dayjs';

function MiddleSide() {
    const dispatch = useDispatch()
    const selectedDate = useSelector((state) => state.date.selectedDate)
    const [viewType, setViewType] = useState('day')

    const isToday = dayjs().isSame(selectedDate, 'day')

    const monthOptions = [
        { value: 'day', label: '일' },
        { value: 'week', label: '주' },
        { value: 'month', label: '월' },
    ]

    // viewType 상태에 따라 현재 선택된 날짜를 가져옴
    const handleMoveDate = (direction) => {
        const unit = viewType === 'day' ? 'day' : viewType === 'week' ? 'week' : 'month'
        const newDate =
            direction === 'prev'
                ? dayjs(selectedDate).subtract(1, unit)
                : dayjs(selectedDate).add(1, unit)

        dispatch(setDate(newDate))
    }

    // viewType에 따른 middleSide 컨텐츠 렌더링
    const renderCalendar = () => {
        switch (viewType) {
            case 'month':
                return <MonthCalendar />
            case 'week':
                return <WeekCalendar />
            case 'day':
            default:
                return <DayCalendar date={dayjs()} />
        }
    }

    return (
        <div>
            {/* middelSide 헤더 */}
            <div className={styles.header}>
                <span className={styles.header__dateText}>
                    {selectedDate.format('YYYY')} <strong>{selectedDate.format('M월')}</strong>
                </span>
                <div className={styles.controls}>
                    <Select
                        value={viewType}
                        options={monthOptions}
                        onChange={(value) => setViewType(value)}
                    />
                    <Button onClick={() => dispatch(setDate(dayjs()))}>오늘</Button>
                    {viewType === 'month' ? (
                        <>
                            <Button
                                type="text"
                                onClick={() => handleMoveDate('prev')}
                                icon={
                                    <span className={styles.controls__changeIcon}>
                                        <UpOutlined />
                                    </span>
                                }
                            />
                            <Button
                                type="text"
                                onClick={() => handleMoveDate('next')}
                                icon={
                                    <span className={styles.controls__changeIcon}>
                                        <DownOutlined />
                                    </span>
                                }
                            />
                        </>
                    ) : (
                        <>
                            <Button
                                type="text"
                                onClick={() => handleMoveDate('prev')}
                                icon={
                                    <span className={styles.controls__changeIcon}>
                                        <LeftOutlined />
                                    </span>
                                }
                            />
                            <Button
                                type="text"
                                onClick={() => handleMoveDate('next')}
                                icon={
                                    <span className={styles.controls__changeIcon}>
                                        <RightOutlined />
                                    </span>
                                }
                            />
                        </>
                    )}
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