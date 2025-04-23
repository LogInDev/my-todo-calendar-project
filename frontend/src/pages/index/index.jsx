import React, { useState } from 'react'
// CSS
import styles from './index.module.scss'
import dayjs from 'dayjs';
// Components
import LeftSide from '@pages/index/components/leftside/LeftSide';
import MiddleSide from '@/pages/index/components/middleside/MiddleSide';

function MainPage() {
    // 현재 월을 관리하는 상태
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    return (
        <div className={styles.container}>
            {/* 왼쪽 사이드 */}
            <div className={styles.leftSide}>
                <LeftSide value={currentMonth} setValue={setCurrentMonth} />
            </div>
            {/* 가운데 */}
            <div className={styles.middleSide}>
                <MiddleSide currentMonth={currentMonth} />
            </div>
            {/* 오른쪽 사이드 */}
            <div className={styles.rightSide}>
                rightSide
            </div>
        </div>
    )
}

export default MainPage