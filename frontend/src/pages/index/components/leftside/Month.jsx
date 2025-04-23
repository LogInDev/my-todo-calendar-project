import React from 'react'
// CSS
import styles from './Month.module.scss'
// antd
import { Calendar } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(weekday);
dayjs.extend(localeData);

const Month = ({ value, setValue }) => {

    const onMonthChange = (direction) => {
        const newValue = direction === 'prev'
            ? value.subtract(1, 'month')
            : value.add(1, 'month');
        setValue(newValue);
    };

    return (
        <div className={styles.wrapper}>
            {/* 상단 커스텀 헤더 */}
            <div className={styles.header}>
                <UpOutlined onClick={() => onMonthChange('prev')} />
                <DownOutlined onClick={() => onMonthChange('next')} />
            </div>

            <Calendar
                fullscreen={false}
                headerRender={() => null} // 📌 기본 헤더 제거
                value={value}
                onSelect={(date) => setValue(date)}
            />
        </div>
    );
};

export default Month;