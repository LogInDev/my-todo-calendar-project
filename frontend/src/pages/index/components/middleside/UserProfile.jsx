import React from 'react'
import apiClient from '@/api/apiClient';
import { useSelector } from 'react-redux';
// CSS
import styles from './UserProfile.module.scss'
// ant Design
import { Dropdown, Avatar } from 'antd';

function UserProfile() {
    const user = useSelector((state) => state.user.user);

    const handleLogout = async () => {
        try {
            await apiClient.post('/api/auth/logout');
            window.location.href = '/login';
        } catch (e) {
            console.error('Logout 실패:', e);
        }
    };

    const items = [
        {
            key: 'logout',
            label: <span onClick={handleLogout}>로그아웃</span>,
        },
    ];

    return (
        <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
            <Avatar
                src={user?.profileImageUrl || '/img/default-profile.png'}
                alt="profile"
                className={styles.userAvatar}
            />
        </Dropdown>
    );
}


export default UserProfile