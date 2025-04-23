import React from 'react'
// CSS
import styles from './TagList.module.scss'
// antd
import { TagOutlined, PlusOutlined } from '@ant-design/icons';
import TagItem from './TagItem';

function TagList() {
    return (
        <div>
            {/* 상단 커스텀 헤더 */}
            <div className={styles.tagHeader}>
                <div>
                    <TagOutlined />Tag
                </div>
                <div className={styles.plusIcon}>
                    {/* 태그 추가 버튼 */}
                    <PlusOutlined />
                </div>
            </div>
            {/* 태그 리스트 */}
            <div className={styles.tagList}>
                <TagItem name="데일리" initialColor="#d5bfbf" />
                <TagItem name="업무" initialColor="#71b3e3" />
            </div>
        </div>
    )
}

export default TagList