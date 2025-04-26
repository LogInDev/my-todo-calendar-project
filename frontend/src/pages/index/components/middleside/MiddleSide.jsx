import React, { useState } from 'react'
// redux
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedDate } from '@/store/dateSlice';
import { closePanel } from '@/store/rightPanelSlice';
// Components
import MonthCalendar from './MonthCalendar';
import SlideCalendar from './SlideCalendar';
import WeekCalendar from './WeekCalendar';
// CSS
import styles from './MiddleSide.module.scss'
// antd
import { Select, Button } from 'antd'
import { UpOutlined, DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
// dayjs
import dayjs from 'dayjs';
import UserProfile from './UserProfile';

function MiddleSide() {
    // 현재 선택된 날짜를 관리하는 상태
    const dispatch = useDispatch()
    const selectedDateStr = useSelector((state) => state.date.selectedDate)
    const selectedDate = dayjs(selectedDateStr)
    // 선택된 컨텐츠 옵션
    const [viewType, setViewType] = useState('day')

    // 슬라이드 효과
    const [slideIndex, setSlideIndex] = useState(1) // 0: 이전, 1: 현재, 2: 다음
    const [isSliding, setIsSliding] = useState(false)

    const handleSlide = (dir) => {
        if (isSliding) return
        const isPrev = dir === 'prev'
        setIsSliding(true)
        setSlideIndex(isPrev ? 0 : 2)

        setTimeout(() => {
            const newDate = dayjs(selectedDate)[isPrev ? 'subtract' : 'add'](1, viewType)
            dispatch(setSelectedDate(newDate.format()))
            setIsSliding(false)
            setSlideIndex(1)
        }, 400)
    }

    const handleWheel = (e) => {
        // 좌우 스크롤에만 반응, 수직 스크롤은 무시
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            if (e.deltaX > 20) handleSlide('next')
            else if (e.deltaX < -20) handleSlide('prev')
        }
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
                return <SlideCalendar selectedDate={selectedDate} slideIndex={slideIndex} isSliding={isSliding} />
        }
    }

    // rightSide 패널 닫기
    const handleCellClick = () => {
        dispatch(closePanel())
    }

    return (
        <div onWheel={handleWheel}> {/* 좌우 휠 이벤트 감지 */}
            {/* middelSide 헤더 */}
            <div className={styles.header} onClick={handleCellClick}>
                <span className={styles.header__dateText}>
                    {selectedDate.format('YYYY')} <strong>{selectedDate.format('M월')}</strong>
                </span>
                <div className={styles.controls}>
                    <UserProfile />
                    {/* 컨텐츠 타입 선택 */}
                    <Select
                        value={viewType} options={[
                            { value: 'day', label: '일' },
                            { value: 'week', label: '주' },
                            { value: 'month', label: '월' },
                        ]}
                        onChange={(value) => setViewType(value)}
                    />
                    <Button onClick={() => dispatch(setSelectedDate(dayjs().format()))}>오늘</Button>
                    {viewType === 'month' ? (
                        <>
                            <Button onClick={() => handleSlide('prev')} icon={<UpOutlined />} />
                            <Button onClick={() => handleSlide('next')} icon={<DownOutlined />} />
                        </>
                    ) : (
                        <>
                            <Button onClick={() => handleSlide('prev')} icon={<LeftOutlined />} />
                            <Button onClick={() => handleSlide('next')} icon={<RightOutlined />} />
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