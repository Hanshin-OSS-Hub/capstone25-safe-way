// 이 코드는 안전 경로 API에서 받은 여러 구간의 geomWkt를
// 하나의 polyline 좌표 배열로 합치는 유틸 함수입니다.

import type { SafePathItem } from "@/src/features/route/api/pathApi";
import { parseLineStringWkt, type MapCoordinate } from "./parseWkt";

// 여러 경로 구간의 WKT를 하나의 좌표 배열로 합치는 함수
export function buildPathCoordinates(pathItems: SafePathItem[]): MapCoordinate[] {
    const coordinates: MapCoordinate[] = [];

    pathItems.forEach((item, index) => {
        const segmentCoordinates = parseLineStringWkt(item.geomWkt);

        if (segmentCoordinates.length === 0) {
            return;
        }

        if (index === 0) {
            coordinates.push(...segmentCoordinates);
            return;
        }

        coordinates.push(...segmentCoordinates.slice(1));
    });

    return coordinates;
}