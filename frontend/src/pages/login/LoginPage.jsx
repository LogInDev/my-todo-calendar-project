import React from 'react'
import { API_BASE_URL } from '@/config'
import styles from './LoginPage.module.scss'

function LoginPage() {
    const handleKakaoLogin = () => {
        window.location.href = `${API_BASE_URL}/oauth2/authorize/kakao`
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h2>My Todo Calendar</h2>
                <p>로그인하여 일정을 관리하세요</p>
                <button className={styles.kakaoBtn} onClick={handleKakaoLogin}>
                    <img src="/img/kakao_login.png" alt="kakao" className={styles.kakaoIcon} />
                </button>
            </div>
        </div>
    )
}

export default LoginPage