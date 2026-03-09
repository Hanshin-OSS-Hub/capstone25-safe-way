// 경로 검색창에서 사용할 더미 데이터입니다.

export interface RecentRouteItem {  // 최근 검색 경로
    id: string;
    from: string;
    to: string;
}

export interface FavoritePlaceItem { // 즐겨찾기 장소
    id: string;
    name: string;
    address: string;
    emoji: string;
}

export const RECENT_ROUTES_MOCK: RecentRouteItem[] = [
    { id: "recent-1", from: "병점역", to: "한신대" },
    { id: "recent-2", from: "서울역", to: "이태원역" },
    { id: "recent-3", from: "혜화역", to: "홍대입구역" },
];

export const FAVORITE_PLACES_MOCK: FavoritePlaceItem[] = [
    { id: "favorite-1", name: "집", address: "서울시 마포구", emoji: "🏠" },
    { id: "favorite-2", name: "회사", address: "경기도 오산시", emoji: "🏢" },
    { id: "favorite-3", name: "병원", address: "서울시 서대문구", emoji: "🏥" },
];

/**
 * TODO:
 * 추후 백엔드 연동 시 이 mock 파일 대신 API 응답값으로 교체
 *
 * 예상 예시
 * - 최근 검색 경로 조회 API
 * - 즐겨찾기 장소 목록 조회 API
 */