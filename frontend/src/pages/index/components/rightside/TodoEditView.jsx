import React, { useEffect, useState } from 'react'
// redux
import { useSelector, useDispatch } from 'react-redux'
import { addTodo, updateTodo } from '@/store/todoSlice'
// CSS
import styles from './TodoEditView.module.scss'
// antd
import { Input, TimePicker, DatePicker, Switch, Select } from 'antd'
import dayjs from 'dayjs'

function TodoEditView({ todo }) {
    const dispatch = useDispatch()
    const isEdit = !!todo?.id
    const tags = useSelector((state) => state.tag.tagList)

    const [title, setTitle] = useState('')
    const [isAllDay, setIsAllDay] = useState(false)
    const [startDate, setStartDate] = useState(dayjs())
    const [endDate, setEndDate] = useState(dayjs().add(1, 'hour'))
    const [selectedTag, setSelectedTag] = useState('')

    const [isNew, setIsNew] = useState(!todo?.id) // id 없으면 새 항목
    const [generatedId] = useState(() => todo?.id || Date.now().toString())

    const syncTodo = (custom = {}) => {
        const finalTitle = custom.title ?? title
        if (!finalTitle.trim()) return

        const payload = {
            ...todo,
            id: generatedId,
            title: finalTitle,
            start: (custom.start || startDate).toISOString(),
            end: (custom.end || endDate).toISOString(),
            isAllDay: custom.isAllDay ?? isAllDay,
            tagId: custom.tagId || selectedTag,
        }

        if (isNew) {
            dispatch(addTodo(payload))
            setIsNew(false)
        } else {
            dispatch(updateTodo(payload))
        }
    }

    // 초기화
    useEffect(() => {
        setTitle(todo?.title || '')
        setIsAllDay(todo?.isAllDay || false)
        setStartDate(dayjs(todo?.start) || dayjs())
        setEndDate(dayjs(todo?.end) || dayjs().add(1, 'hour'))
        if (todo?.tagId) setSelectedTag(todo.tagId)
        else if (tags.length > 0) setSelectedTag(tags[0].id)
        console.log(todo)
    }, [todo, tags])

    // todo 수정 시 바로 반영
    // 시작 시간
    const handleStartChange = (v) => {
        if (!v) return
        const updated = startDate.hour(v.hour()).minute(v.minute())
        setStartDate(updated)
        syncTodo({ start: updated })
    }

    const handleEndChange = (v) => {
        if (!v) return
        const updated = endDate.hour(v.hour()).minute(v.minute())
        setEndDate(updated)
        syncTodo({ end: updated })
    }

    const handleStartDateChange = (v) => {
        if (!v) return
        const updated = v.hour(startDate.hour()).minute(startDate.minute())
        setStartDate(updated)
        syncTodo({ start: updated })
    }

    const handleEndDateChange = (v) => {
        if (!v) return
        const updated = v.hour(endDate.hour()).minute(endDate.minute())
        setEndDate(updated)
        syncTodo({ end: updated })
    }

    const handleTitleChange = (e) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        syncTodo({ title: newTitle })
    }

    const handleAllDayChange = (v) => {
        setIsAllDay(v)
        const start = v ? startDate.startOf('day') : startDate
        const end = v ? endDate.startOf('day') : endDate
        setStartDate(start)
        setEndDate(end)
        syncTodo({ isAllDay: v, start, end })
    }

    const handleTagChange = (v) => {
        setSelectedTag(v)
        syncTodo({ tagId: v })
    }


    return (
        <div style={{ padding: 16 }}>
            <h3>{isEdit ? 'Edit Todo' : 'Add Todo'}</h3>
            {/* 제목 입력 */}
            <Input
                placeholder="할 일을 작성하세요"
                value={title}
                onChange={handleTitleChange}
                style={{ marginBottom: 12 }}
                variant='borderless'
            />

            {/* 시간/날짜 입력 */}
            {isAllDay ? (
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <DatePicker value={startDate} onChange={handleStartDateChange} style={{ flex: 1, maxWidth: 140 }} />
                    <span>→</span>
                    <DatePicker value={endDate} onChange={handleEndDateChange} style={{ flex: 1, maxWidth: 140 }} />
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <TimePicker
                            value={startDate}
                            onChange={handleStartChange}
                            format="HH:mm"
                            minuteStep={5}
                            showNow={false}
                            allowClear={false}
                            variant="borderless"
                            style={{ flex: 1, maxWidth: 120 }}
                        />
                        <span>→</span>
                        <TimePicker
                            value={endDate}
                            onChange={handleEndChange}
                            format="HH:mm"
                            minuteStep={5}
                            showNow={false}
                            allowClear={false}
                            variant="borderless"
                            style={{ flex: 1, maxWidth: 120 }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <DatePicker
                            value={startDate}
                            onChange={handleStartDateChange}
                            style={{ flex: 1, maxWidth: 140 }}
                            format="YY-MM-DD"
                        />
                        <span>→</span>
                        <DatePicker
                            value={endDate}
                            onChange={handleEndDateChange}
                            style={{ flex: 1, maxWidth: 140 }}
                            format="YY-MM-DD"
                        />
                    </div>
                </>
            )}

            {/* 종일 */}
            <div style={{ marginBottom: 8 }}>
                <Switch checked={isAllDay} onChange={handleAllDayChange} /> 종일
            </div>

            {/* 태그 선택 */}
            <div style={{ marginBottom: 12 }}>
                <Select
                    value={selectedTag}
                    onChange={handleTagChange}
                    options={tags.map((tag) => ({
                        label: tag.name,
                        value: tag.id,
                    }))}
                    style={{ width: '100%' }}
                    placeholder="태그 선택"
                />
            </div>
        </div>
    )
}
export default TodoEditView