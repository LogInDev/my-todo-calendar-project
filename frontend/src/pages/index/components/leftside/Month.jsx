import React from 'react'
// redux
import { useSelector, useDispatch } from 'react-redux'
import { setDate } from '@/store/dateSlice'
// CSS
import styles from './Month.module.scss'
// antd
import { Button, Calendar } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
// dayjs
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(weekday);
dayjs.extend(localeData);

const Month = () => {
    const dispatch = useDispatch()
    const selectedDate = useSelector((state) => state.date.selectedDate)

    const onMonthChange = (direction) => {
        const newDate = direction === 'prev'
            ? dayjs(selectedDate).subtract(1, 'month')
            : dayjs(selectedDate).add(1, 'month')

        dispatch(setDate(newDate))
    }

    return (
        <div className={styles.wrapper}>
            {/* 상단 커스텀 헤더 */}
            <div className={styles.header}>
                <Button
                    type="text"
                    size="small"
                    icon={<UpOutlined />}
                    onClick={() => onMonthChange('prev')}
                    className={styles.header__navBtn}
                />
                <Button
                    type="text"
                    size="small"
                    icon={<DownOutlined />}
                    onClick={() => onMonthChange('next')}
                    className={styles.header__navBtn}
                />
            </div>

            <Calendar
                fullscreen={false}
                headerRender={() => null} // 기본 헤더 제거
                value={dayjs(selectedDate)}
                onSelect={(date) => dispatch(setDate(date))}
                dateFullCellRender={(date) => {
                    const isToday = date.isSame(dayjs(), 'day')
                    const isSelected = date.isSame(selectedDate, 'day')

                    let className = styles.defaultDateCell
                    if (isToday && isSelected) className = styles.todaySelected
                    else if (isToday) className = styles.today
                    else if (isSelected) className = styles.selected

                    return <div className={className}>{date.date()}</div>
                }}
            />
        </div>
    );
};

export default Month;