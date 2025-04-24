import React, { useRef, useEffect } from 'react'
import { nanoid } from 'nanoid'; // 고유 id 생성용
// redux
import { useDispatch, useSelector } from 'react-redux';
import { addTag, ensureDefaultTag, updateTagName, updateTagColor, removeTag } from '@/store/tagSlice';
// CSS
import styles from './TagList.module.scss'
import { getRandomColor } from '@utils/colorUtils'
// antd
import { TagOutlined, PlusOutlined } from '@ant-design/icons';
import TagItem from './TagItem';

function TagList() {
    const dispatch = useDispatch();
    const tags = useSelector((state) => state.tag.tagList)
    const inputRefs = useRef({});

    // 태그가 없을 경우 기본 태그 생성
    useEffect(() => {
        if (tags.length === 0) {
            dispatch(ensureDefaultTag())
        }
    }, [tags])

    const handleAddTag = () => {
        const newTag = {
            id: nanoid(),
            name: '',
            color: getRandomColor(),
        };
        dispatch(addTag(newTag))

        setTimeout(() => {
            inputRefs.current[newTag.id]?.focus();
        }, 100);
    };

    // 태그 이름 변경
    const handleNameChange = (id, value) => {
        dispatch(updateTagName({ id, name: value }))
    };

    // 태그 색상 변경
    const handleColorChange = (id, newColor) => {
        dispatch(updateTagColor({ id, newColor }))
    };

    // 태그 이름이 비어있을 때 삭제
    const handleBlur = (id, value) => {
        if (!value.trim()) {
            dispatch(removeTag(id))
        }
    };

    // 태그 삭제
    const handleRemove = (id) => {
        dispatch(removeTag(id))
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