import React, { useState } from 'react'
// redux
import { useDispatch } from 'react-redux'
import { closePanel } from '@/store/rightPanelSlice'
// CSS
import styles from './index.module.scss'
import dayjs from 'dayjs';
// Components
import LeftSide from '@pages/index/components/leftside/LeftSide';
import MiddleSide from '@/pages/index/components/middleside/MiddleSide';
import RightSide from './components/rightside/RightSide';

function MainPage() {
    const dispatch = useDispatch()
    // 현재 월을 관리하는 상태
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [monthPickerOpen, setMonthPickerOpen] = useState(false);

    // rightSide 패널 닫기
    const handleCellClick = () => {
        dispatch(closePanel())
    }

    return (
        <div className={styles.container}>
            {/* 왼쪽 사이드 */}
            <div className={styles.leftSide} onClick={handleCellClick}>
                <LeftSide value={currentMonth} setValue={setCurrentMonth} />
            </div>
            {/* 가운데 */}
            <div className={styles.middleSide}>
                <MiddleSide
                    currentMonth={dayjs()} // dayjs 객체
                    onTodayClick={() => setCurrentMonth(dayjs())}
                />
            </div>
            {/* 오른쪽 사이드 */}
            <div className={styles.rightSide}>
                <RightSide />
            </div>
        </div>
    )
}

export default MainPage