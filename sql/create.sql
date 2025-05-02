-- 1. 사용자 테이블
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 고유 아이디',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT '카카오 계정 이메일 (고유)',
    nickname VARCHAR(100) COMMENT '사용자 닉네임',
    profile_image_url VARCHAR(500) COMMENT '카카오 프로필 이미지 URL',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '사용자 생성 일시',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '사용자 수정 일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 테이블';

-- 2. 태그 테이블
CREATE TABLE tags (
	id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '태그 고유 아이디',
    user_id BIGINT NOT NULL COMMENT '태그 소유자 ID (users 테이블 참조)',
    name VARCHAR(100) NOT NULL COMMENT '태그 이름',
    color VARCHAR(10) NOT NULL COMMENT '태그 색상 (Hex 값 등)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '태그 생성 일시',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '태그 수정 일시',
    CONSTRAINT fk_tag_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='할일 태그 테이블';

-- 3. 할일 테이블
CREATE TABLE todos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '할일 고유 아이디',
    user_id BIGINT NOT NULL COMMENT '할일 작성자 ID (users 테이블 참조)',
    tag_id BIGINT COMMENT '태그 ID (tags 테이블 참조)',
    title VARCHAR(255) NOT NULL COMMENT '할일 제목',
    start_datetime DATETIME COMMENT '할일 시작 일시',
    end_datetime DATETIME COMMENT '할일 종료 일시',
    is_all_day BOOLEAN DEFAULT FALSE COMMENT '종일 일정 여부 (true: 종일)',
    completed BOOLEAN DEFAULT FALSE COMMENT '할일 완료 여부 (true: 완료)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '할일 생성 일시',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '할일 수정 일시',
    CONSTRAINT fk_todo_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_todo_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='할일 관리 테이블';

-- 4. oauth 연동 관리 테이
CREATE TABLE user_oauth (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '연동 로그인 고유 ID',

    user_id BIGINT NOT NULL COMMENT 'users 테이블의 사용자 고유 ID',
    provider VARCHAR(50) NOT NULL COMMENT 'OAuth 제공자(kakao, google, naver 등)',
    oauth_id VARCHAR(255) NOT NULL COMMENT 'OAuth 제공자가 발급한 사용자 고유 식별자',
    
    refresh_token TEXT COMMENT 'OAuth refresh_token (access_token 재발급용)',
    refresh_token_expires_at DATETIME COMMENT 'refresh_token 만료 시각',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

    CONSTRAINT uq_provider_oauth_id UNIQUE (provider, oauth_id),
    CONSTRAINT fk_useroauth_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 OAuth 연동 정보';


