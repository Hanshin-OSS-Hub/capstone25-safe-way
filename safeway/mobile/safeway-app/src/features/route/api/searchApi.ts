// 이 코드는 장소 검색 화면에서 검색어를 기반으로
// 백엔드 장소 검색 API를 호출하는 코드입니다.

import { apiClient } from "@/src/shared/api/client";

// 장소 검색 결과 한 건을 나타내는 타입
export interface SearchPlaceItem {
    addressName: string;
    categoryName: string;
    lat: string;
    lon: string;
    placeName: string;
    roadAddressName: string;
}

// 검색어를 기반으로 장소 검색 결과 목록을 조회하는 함수
export async function searchPlaces(keyword: string): Promise<SearchPlaceItem[]> {
    const response = await apiClient.get<SearchPlaceItem[]>("/api/location/search", {
        params: {
            keyword,
        },
    });

    return response.data;
}