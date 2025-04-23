import React from 'react'
// CSS
import styles from './LeftSide.module.scss'
// Components
import Month from './Month';
import TagList from './TagList';

function LeftSide({ value, setValue }) {
    return (
        <div className={styles.wrapper}>
            {/* 월별 달력 */}
            <Month value={value} setValue={setValue} />
            {/* 태그 */}
            <TagList />
        </div>
    )
}

export default LeftSide