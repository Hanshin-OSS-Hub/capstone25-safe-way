// 이 코드는 좌표(x, y)를 백엔드에 보내서 주소 정보를 받아오는 API 코드입니다.
// 현재 위치를 주소 문자열로 바꿔서 검색창이나 출발지/도착지 표시용

import { apiClient } from "@/src/shared/api/client";

// 응답의 meta 정보를 나타내는 타입
interface LocationAddressMeta {
    total_count: number;
}

// 응답에 포함된 도로명 주소 정보를 나타내는 타입
interface RoadAddress {
    address_name?: string | null;
}

// 일반 지번 주소 정보를 나타내는 타입
interface AddressInfo {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
    zip_code: string;
}

// 주소 검색 결과 한 건을 나타내는 타입
interface LocationAddressDocument {
    road_address: RoadAddress | null;
    address: AddressInfo;
}

// 백엔드 전체 응답 구조를 나타내는 타입
interface GetAddressByCoordinateResponse {
    meta: LocationAddressMeta;
    documents: LocationAddressDocument[];
}

// 프론트에서 실제로 쓰기 쉽게 가공한 주소 결과 타입
export interface ResolvedAddress {
    fullAddress: string;
    roadAddress: string | null;
    region1Depth: string;
    region2Depth: string;
    region3Depth: string;
}

// 좌표(x, y)를 받아서 백엔드로 주소 변환 요청을 보내는 함수
export async function getAddressByCoordinate(
    x: number,
    y: number
): Promise<ResolvedAddress | null> {
    const response = await apiClient.get<GetAddressByCoordinateResponse>(
        "/api/location/address",
        {
            params: {
                x,
                y,
            },
        }
    );

    const firstDocument = response.data.documents?.[0];

    if (!firstDocument) {
        return null;
    }

    return {
        fullAddress: firstDocument.address.address_name,
        roadAddress: firstDocument.road_address?.address_name ?? null,
        region1Depth: firstDocument.address.region_1depth_name,
        region2Depth: firstDocument.address.region_2depth_name,
        region3Depth: firstDocument.address.region_3depth_name,
    };
}