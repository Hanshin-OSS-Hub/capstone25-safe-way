// 이 코드는 WKT 형식의 POINT와 LINESTRING 문자열을
// 지도에서 사용할 수 있는 좌표 데이터로 변환하는 유틸 코드입니다.

export interface MapCoordinate {
    latitude: number;
    longitude: number;
}

// WKT LINESTRING 문자열을 좌표 배열로 변환하는 함수
export function parseLineStringWkt(wkt: string): MapCoordinate[] {
    if (!wkt || !wkt.startsWith("LINESTRING")) {
        return [];
    }

    const cleaned = wkt
        .replace("LINESTRING(", "")
        .replace(")", "")
        .trim();

    if (!cleaned) {
        return [];
    }

    return cleaned.split(",").map((point) => {
        const [longitude, latitude] = point.trim().split(/\s+/).map(Number);

        return {
            latitude,
            longitude,
        };
    });
}

// WKT POINT 문자열을 좌표 객체로 변환하는 함수
export function parsePointWkt(wkt: string): MapCoordinate | null {
    if (!wkt || !wkt.startsWith("POINT")) {
        return null;
    }

    const cleaned = wkt
        .replace("POINT(", "")
        .replace(")", "")
        .trim();

    if (!cleaned) {
        return null;
    }

    const [longitude, latitude] = cleaned.split(/\s+/).map(Number);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return null;
    }

    return {
        latitude,
        longitude,
    };
}