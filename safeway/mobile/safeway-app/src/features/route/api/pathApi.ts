// 이 코드는 좌표를 노드로 변환하고,
// 시작 노드와 도착 노드를 기준으로 안전 경로를 조회하는 API 코드입니다.

import { apiClient } from "@/src/shared/api/client";

// 좌표를 가장 가까운 노드로 변환한 결과 타입
export interface ConvertNodeResponse {
    nodeId: number;
    geomWkt: string;
    distanceM: number;
}

// 안전 경로의 각 구간 정보를 나타내는 타입
export interface SafePathItem {
    seq: number;
    nodeId: number;
    edgeId: number;
    cost: number;
    aggCost: number;
    geomWkt: string;
}

// 경도, 위도를 가장 가까운 경로 노드로 변환하는 함수
export async function convertCoordinateToNode(
    lon: number,
    lat: number
): Promise<ConvertNodeResponse> {
    const response = await apiClient.get<ConvertNodeResponse>("/api/path/convert", {
        params: {
            lon,
            lat,
        },
    });

    return response.data;
}

// 시작 노드와 도착 노드를 기준으로 안전 경로를 조회하는 함수
export async function fetchSafePath(
    startNode: number,
    endNode: number
): Promise<SafePathItem[]> {
    const response = await apiClient.get<SafePathItem[]>("/api/path/safe", {
        params: {
            startNode,
            endNode,
        },
    });

    return response.data;
}