import React, { useRef, useEffect } from 'react'
import TagItem from './TagItem';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { addTag, loadTags, updateTagAsync, removeTag } from '@/store/tagSlice';
// CSS
import styles from './TagList.module.scss'
import { getRandomColor } from '@utils/colorUtils'
// antd
import { TagOutlined, PlusOutlined } from '@ant-design/icons';

function TagList() {
    const dispatch = useDispatch();
    const serverTagList = useSelector((state) => state.tag.tagList)
    const inputRefs = useRef({});

    // '태그 없음' 추가
    const tagList = [
        { id: null, name: '태그 없음', color: 'transparent' },
        ...serverTagList
    ];

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
        if (!value.trim() && id !== null) {
            dispatch(removeTag(id))
        }
    };

    // 태그 삭제
    const handleRemove = (id) => {
        if (id !== null) {
            dispatch(removeTag(id))
                .unwrap()
                .then(() => dispatch(loadTags()));
        }
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