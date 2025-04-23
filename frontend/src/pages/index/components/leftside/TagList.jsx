import React, { useState, useRef } from 'react'
import { nanoid } from 'nanoid'; // 고유 id 생성용
// CSS
import styles from './TagList.module.scss'
// antd
import { TagOutlined, PlusOutlined } from '@ant-design/icons';
import TagItem from './TagItem';

function getRandomColor() {
    const colors = ['#d5bfbf', '#71b3e3', '#a3da8d', '#ffd666', '#ff85c0'];
    return colors[Math.floor(Math.random() * colors.length)];
}


function TagList() {
    const [tags, setTags] = useState([
        { id: nanoid(), name: '데일리', color: '#d5bfbf' },
        { id: nanoid(), name: '업무', color: '#71b3e3' },
    ]);
    const inputRefs = useRef({});

    const handleAddTag = () => {
        const newTag = {
            id: nanoid(),
            name: '',
            color: getRandomColor(),
        };
        setTags((prev) => [...prev, newTag]);

        setTimeout(() => {
            inputRefs.current[newTag.id]?.focus();
        }, 100);
    };

    // 태그 이름 변경
    const handleNameChange = (id, value) => {
        setTags((prev) =>
            prev.map((tag) => (tag.id === id ? { ...tag, name: value } : tag))
        );
    };

    // 태그 색상 변경
    const handleColorChange = (id, newColor) => {
        setTags((prev) =>
            prev.map((tag) => (tag.id === id ? { ...tag, color: newColor } : tag))
        );
    };

    // 태그 이름이 비어있을 때 삭제
    const handleBlur = (id, value) => {
        if (!value.trim()) {
            setTags((prev) => prev.filter((tag) => tag.id !== id));
        }
    };

    // 태그 삭제
    const handleRemove = (id) => {
        setTags((prev) => prev.filter((tag) => tag.id !== id));
    };

    return (
        <div>
            {/* 태그 헤더 */}
            <div className={styles.tagHeader}>
                <div>
                    <TagOutlined /> Tag
                </div>
                <div className={styles.plusIcon} onClick={handleAddTag}>
                    <PlusOutlined />
                </div>
            </div>
            {/* 태그 리스트 */}
            <div className={styles.tagList}>
                {tags.map((tag) => (
                    <TagItem
                        key={tag.id}
                        id={tag.id}
                        name={tag.name}
                        color={tag.color}
                        inputRef={(el) => (inputRefs.current[tag.id] = el)}
                        onChange={(value) => handleNameChange(tag.id, value)}
                        onBlur={(value) => handleBlur(tag.id, value)}
                        onColorChange={(newColor) => handleColorChange(tag.id, newColor)}
                        onRemove={handleRemove}
                    />
                ))}
            </div>
        </div>
    );
}

export default TagList