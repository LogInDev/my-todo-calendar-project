import React, { useState } from 'react'
// redux
import { closePanel } from '@/store/rightPanelSlice'
import { useDispatch } from 'react-redux'
// CSS
import styles from './TodoEditView.module.scss'
// antd
import { Input, TimePicker, Switch, Button } from 'antd'
import dayjs from 'dayjs'

function TodoEditView({ todo }) {
    const dispatch = useDispatch()
    const isEdit = todo && todo.id

    // dayjs로 다시 파싱
    const [title, setTitle] = useState(todo?.title || '')
    const [start, setStart] = useState(dayjs(todo?.start))  // ISO → dayjs
    const [end, setEnd] = useState(dayjs(todo?.end))
    const [allDay, setAllDay] = useState(todo?.isAllDay || false)

    const handleSave = () => {
        const newTodo = {
            id: isEdit ? todo.id : Date.now().toString(),
            title,
            start,
            end,
            isAllDay: allDay,
        }
        console.log(isEdit ? '수정된 일정' : '새 일정 생성', newTodo)
        dispatch(closePanel())
    }

    return (
        <div style={{ padding: 16 }}>
            <h3>{isEdit ? 'Edit Event' : 'New Event'}</h3>
            <Input
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ marginBottom: 12 }}
            />
            {!allDay && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <TimePicker
                        value={start}
                        onChange={setStart}
                        format="HH:mm"
                    />
                    <span>→</span>
                    <TimePicker
                        value={end}
                        onChange={setEnd}
                        format="HH:mm"
                    />
                </div>
            )}
            <div style={{ marginBottom: 12 }}>
                <Switch
                    checked={allDay}
                    onChange={setAllDay}
                />{' '}
                All-day
            </div>
            <Button type="primary" onClick={handleSave}>
                Save
            </Button>
        </div>
    )
}

export default TodoEditView