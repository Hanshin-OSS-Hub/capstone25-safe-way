-- 1. PostGIS 확장 기능 활성화 (공간 데이터 처리를 위해 필수)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. 사용자 테이블
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    kakao_id VARCHAR(100) UNIQUE NOT NULL,
    nickname VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 도로 구간 테이블 (경로 알고리즘용 거리/경사/폭 포함)
CREATE TABLE way_segments (
    segment_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    geom GEOMETRY(LineString, 4326), -- 공간 데이터 (경로 선형)
    slope_percent FLOAT,            -- 경사도 (%)
    width_m FLOAT,                  -- 도로 폭 (m)
    length_m FLOAT,                 -- 구간 길이 (m, 경로 계산용 가중치)
    is_accessible_wheelchair BOOLEAN DEFAULT TRUE
);

-- 4. 접근성 시설물 테이블 (엘리베이터, 경사로 등)
CREATE TABLE accessibility_features (
    feature_id SERIAL PRIMARY KEY,
    segment_id INTEGER REFERENCES way_segments(segment_id) ON DELETE SET NULL,
    feature_type VARCHAR(50),       -- ELEVATOR, RAMP, TOILET 등
    geom GEOMETRY(Point, 4326),     -- 시설물 위치
    description TEXT,
    is_operational BOOLEAN DEFAULT TRUE, -- 운영 여부
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 장애물 제보 및 검증 테이블
CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    report_type VARCHAR(50),        -- CONST(공사), STEEP(급경사), BARRIER(턱) 등
    content TEXT,
    image_url VARCHAR(255),         -- AWS S3 URL 저장
    geom GEOMETRY(Point, 4326),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
        verified_by INTEGER REFERENCES users(user_id), -- 봉사자 또는 관리자 ID
    verified_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. 장애인 전용 콜택시 테이블
CREATE TABLE wheelchair_taxis (
    taxi_id SERIAL PRIMARY KEY,
    driver_name VARCHAR(100),
    phone VARCHAR(50),
    vehicle_type VARCHAR(50),       -- 슬로프형, 리프트형 구분
    geom GEOMETRY(Point, 4326),     -- 현재 실시간 위치
    is_available BOOLEAN DEFAULT TRUE,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. 성능 향상을 위한 공간 인덱스 생성
CREATE INDEX idx_way_segments_geom ON way_segments USING GIST (geom);
CREATE INDEX idx_reports_geom ON reports USING GIST (geom);
CREATE INDEX idx_taxis_geom ON wheelchair_taxis USING GIST (geom);