import React, { useRef, useEffect } from 'react'
// redux
import { useDispatch, useSelector } from 'react-redux';
import { addTag, loadTags, updateTagAsync, removeTag } from '@/store/tagSlice';
// CSS
import styles from './TagList.module.scss'
import { getRandomColor } from '@utils/colorUtils'
// antd
import { TagOutlined, PlusOutlined } from '@ant-design/icons';
import TagItem from './TagItem';

function TagList() {
    const dispatch = useDispatch();
    const tagList = useSelector((state) => state.tag.tagList)
    const inputRefs = useRef({});

    useEffect(() => {
        const loadAndEnsureTag = async () => {
            const resultAction = await dispatch(loadTags());
            if (loadTags.fulfilled.match(resultAction)) {
                const loadedTags = resultAction.payload;
                if (loadedTags.length === 0) {
                    const defaultTag = {
                        name: 'New Tag',
                        color: getRandomColor(),
                    };
                    await dispatch(addTag(defaultTag)).unwrap();
                }
            }
        };
        loadAndEnsureTag();
    }, [dispatch]);

    const handleAddTag = async () => {
        const newTag = {
            name: '',
            color: getRandomColor(),
        };
        const resultAction = await dispatch(addTag(newTag));

        if (addTag.fulfilled.match(resultAction)) {
            const createdTag = resultAction.payload;
            setTimeout(() => {
                inputRefs.current[createdTag.id]?.focus();
            }, 100);
        }
    };

    // 태그가 모두 삭제됐을 때 New Tag 자동 추가
    useEffect(() => {
        if (tagList.length === 0) {
            dispatch(addTag({ name: 'New Tag', color: getRandomColor() }));
        }
    }, [tagList, dispatch]);

    // 태그 이름 변경
    const handleNameChange = (id, value) => {
        dispatch(updateTagAsync({ id, name: value, color: undefined }));
    };

    // 태그 색상 변경
    const handleColorChange = (id, newColor) => {
        dispatch(updateTagAsync({ id, name: undefined, color: newColor }));
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
            <div>
                {tagList.map((tag) => (
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