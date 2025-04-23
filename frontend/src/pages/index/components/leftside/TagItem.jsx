import React, { useState } from 'react';
import { MoreOutlined, EyeOutlined } from '@ant-design/icons';
import { Dropdown, ColorPicker, Button } from 'antd';
import styles from './TagItem.module.scss';

function TagItem({ name, initialColor = '#d5bfbf' }) {
    const [color, setColor] = useState(initialColor);

    const items = [
        {
            key: 'color',
            label: (
                <ColorPicker
                    defaultValue={color}
                    onChangeComplete={(color) => setColor(color.toHexString())}
                />
            ),
        },
    ];

    return (
        <div className={styles.tagItem}>
            <span className={styles.colorDot} style={{ backgroundColor: color }} />
            <span className={styles.name}>{name}</span>
            <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                <MoreOutlined className={styles.moreIcon} />
            </Dropdown>
            <EyeOutlined className={styles.eyeIcon} />
        </div>
    );
}

export default TagItem