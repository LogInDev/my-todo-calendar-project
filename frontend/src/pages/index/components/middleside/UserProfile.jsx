import React from 'react'
import apiClient from '@/api/apiClient';
import { useSelector } from 'react-redux';
import { KAKAO_REST_API_KEY } from '@/config';
// CSS
import styles from './UserProfile.module.scss'
// ant Design
import { Dropdown, Avatar } from 'antd';

function UserProfile() {
    const user = useSelector((state) => state.user.user);

    const handleLogout = async () => {
        try {
            await apiClient.post('/api/auth/logout');
            const LOGOUT_REDIRECT_URI = `${window.location.origin}/login`;
            const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_REST_API_KEY}&logout_redirect_uri=${encodeURIComponent(LOGOUT_REDIRECT_URI)}`;

            window.location.href = kakaoLogoutUrl;
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