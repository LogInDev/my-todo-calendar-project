import React from 'react'
import styles from './LoginPage.module.scss'

function LoginPage() {
    const handleKakaoLogin = () => {
        window.location.href = 'https://kauth.kakao.com/oauth/authorize?...' // 실제 redirect URL
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