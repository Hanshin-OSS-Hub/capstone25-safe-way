-- PostGIS 활성화 및 테이블 생성 (최초 1회 자동 실행)
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    kakao_id VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    pref_slope_limit FLOAT DEFAULT 10.0,   
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS way_segments (
    segment_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    geom GEOMETRY(LineString, 4326),
    slope_percent FLOAT DEFAULT 0,
    width_m FLOAT DEFAULT 1.5,
    has_stairs BOOLEAN DEFAULT FALSE,
    has_ramp BOOLEAN DEFAULT FALSE,
    surface_type VARCHAR(50),
    difficulty_score FLOAT DEFAULT 0
);

-- 공간 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_way_segments_geom ON way_segments USING GIST (geom);
