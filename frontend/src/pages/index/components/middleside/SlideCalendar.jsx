import React from 'react'
// Components
import DayCalendar from './DayCalendar'
// CSS
import styles from './SlideCalendar.module.scss'
import dayjs from 'dayjs'

function SlideCalendar({ selectedDate, slideIndex, isSliding }) {
    const prevDate = dayjs(selectedDate).subtract(1, 'day')
    const nextDate = dayjs(selectedDate).add(1, 'day')

    return (
        <div className={styles.sliderWrapper}>
            <div
                className={`${styles.sliderTrack} ${!isSliding ? styles.noTransition : ''}`}
                style={{ '--slide-index': slideIndex }}
            >
                <div className={styles.slidePage}><DayCalendar date={prevDate} /></div>
                <div className={styles.slidePage}><DayCalendar date={selectedDate} /></div>
                <div className={styles.slidePage}><DayCalendar date={nextDate} /></div>
            </div>
        </div>
    )
}

export default SlideCalendar
