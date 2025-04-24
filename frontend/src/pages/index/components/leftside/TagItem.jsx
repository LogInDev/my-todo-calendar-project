import React from 'react';
import { MoreOutlined, EyeOutlined, CloseOutlined } from '@ant-design/icons';
import { Dropdown, Input, ColorPicker } from 'antd';
import styles from './TagItem.module.scss';

function TagItem({ id, name, color, inputRef, onChange, onBlur, onColorChange, onRemove }) {
    const items = [
        {
            key: 'color',
            label: (
                <div style={{ padding: 8 }}>
                    <ColorPicker
                        defaultValue={color}
                        onChangeComplete={(c) => onColorChange(c.toHexString())}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className={styles.tagItem}>
            <span className={styles.colorDot} style={{ backgroundColor: color }} />
            <Input
                value={name}
                placeholder="태그 이름 입력"
                onChange={(e) => onChange(e.target.value)}
                onBlur={(e) => onBlur(e.target.value)}
                ref={inputRef}
                variant="borderless"
                className={styles.tagInput}
            />
            <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                <MoreOutlined className={styles.moreIcon} />
            </Dropdown>
            <EyeOutlined className={styles.eyeIcon} />
            <CloseOutlined
                className={styles.closeIcon}
                onClick={() => onRemove(id)}
            />
        </div>
    );
}


export default TagItem