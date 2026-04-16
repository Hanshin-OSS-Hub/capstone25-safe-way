// 이 코드는 경로 결과 화면에서 출발지와 도착지 좌표를 기준으로
// 노드 변환 API와 안전 경로 API를 호출한 뒤
// 카카오맵 WebView에 실제 경로를 렌더링하는 컴포넌트입니다.
// 출발지와 도착지 마커는 convert API의 geomWkt 결과를 사용하여
// 경로선과 자연스럽게 맞도록 보정합니다.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    View,
} from "react-native";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";

import { createRouteMapHtml } from "@/src/features/route/createRouteMapHtml";
import { KAKAO_JS_KEY } from "@/src/shared/constants/env";
import RouteTopSearchBar from "@/src/features/route/components/RouteTopSearchBar";
import RouteOptionCard from "@/src/features/route/components/RouteOptionCard";
import RouteBottomActionBar from "@/src/features/route/components/RouteBottomActionBar";
import {
    convertCoordinateToNode,
    fetchSafePath,
} from "@/src/features/route/api/pathApi";
import { buildPathCoordinates } from "@/src/features/route/utils/buildPathCoordinates";
import { parsePointWkt } from "@/src/features/route/utils/parseWkt";

type RouteOptionType = "manual" | "electric";

type MapPathPoint = {
    lat: number;
    lng: number;
};

type MarkerPoint = {
    lat: number;
    lng: number;
};

const ROUTE_OPTIONS = {
    manual: {
        title: "수동 휠체어",
        subtitle: "경사 낮은 경로",
        duration: "24분",
        distance: "384m",
    },
    electric: {
        title: "전기 휠체어",
        subtitle: "이동시간 우선",
        duration: "18분",
        distance: "384m",
    },
};

export default function RouteResultScreen() {
    const webViewRef = useRef<WebView>(null);
    const [selectedType, setSelectedType] = useState<RouteOptionType>("electric");
    const [path, setPath] = useState<MapPathPoint[]>([]);
    const [isLoadingRoute, setIsLoadingRoute] = useState(true);
    const [startMarker, setStartMarker] = useState<MarkerPoint | null>(null);
    const [endMarker, setEndMarker] = useState<MarkerPoint | null>(null);

    const {
        start,
        end,
        startLat,
        startLng,
        endLat,
        endLng,
    } = useLocalSearchParams<{
        start?: string;
        end?: string;
        startLat?: string;
        startLng?: string;
        endLat?: string;
        endLng?: string;
    }>();

    const startName =
        typeof start === "string" && start.trim().length > 0
            ? start
            : "출발지";

    const endName =
        typeof end === "string" && end.trim().length > 0
            ? end
            : "도착지";

    const parsedStartLat = Number(startLat);
    const parsedStartLng = Number(startLng);
    const parsedEndLat = Number(endLat);
    const parsedEndLng = Number(endLng);

    // 출발지와 도착지 좌표를 기준으로 노드 변환 및 안전 경로 조회를 수행하는 함수
    const loadSafeRoute = useCallback(async () => {
        if (
            Number.isNaN(parsedStartLat) ||
            Number.isNaN(parsedStartLng) ||
            Number.isNaN(parsedEndLat) ||
            Number.isNaN(parsedEndLng)
        ) {
            Alert.alert("경로 조회 실패", "출발지 또는 도착지 좌표가 올바르지 않습니다.");
            setIsLoadingRoute(false);
            return;
        }

        try {
            setIsLoadingRoute(true);

            const startNodeResult = await convertCoordinateToNode(
                parsedStartLng,
                parsedStartLat
            );



            const endNodeResult = await convertCoordinateToNode(
                parsedEndLng,
                parsedEndLat
            );

            console.log("출발지 convert 결과:", startNodeResult);
            console.log("도착지 convert 결과:", endNodeResult);
            console.log("startNodeId:", startNodeResult?.nodeId);
            console.log("endNodeId:", endNodeResult?.nodeId);
            const startNodeId = Number(startNodeResult.nodeId);
            const endNodeId = Number(endNodeResult.nodeId);

            console.log("safe API 요청값:", {
                startNodeId,
                endNodeId,
            });

            try {
                const safePath = await fetchSafePath(startNodeId, endNodeId);
                console.log("safePath 응답:", safePath);
            } catch (error) {
                console.error("safe API 에러:", error);
            }

            const safePath = await fetchSafePath(
                startNodeResult.nodeId,
                endNodeResult.nodeId
            );

            const routeCoordinates = buildPathCoordinates(safePath);

            const mappedPath = routeCoordinates.map((coordinate) => ({
                lat: coordinate.latitude,
                lng: coordinate.longitude,
            }));

            const parsedStartMarker = parsePointWkt(startNodeResult.geomWkt);
            const parsedEndMarker = parsePointWkt(endNodeResult.geomWkt);

            setPath(mappedPath);

            setStartMarker(
                parsedStartMarker
                    ? {
                        lat: parsedStartMarker.latitude,
                        lng: parsedStartMarker.longitude,
                    }
                    : mappedPath[0]
                        ? {
                            lat: mappedPath[0].lat,
                            lng: mappedPath[0].lng,
                        }
                        : {
                            lat: parsedStartLat,
                            lng: parsedStartLng,
                        }
            );

            setEndMarker(
                parsedEndMarker
                    ? {
                        lat: parsedEndMarker.latitude,
                        lng: parsedEndMarker.longitude,
                    }
                    : mappedPath[mappedPath.length - 1]
                        ? {
                            lat: mappedPath[mappedPath.length - 1].lat,
                            lng: mappedPath[mappedPath.length - 1].lng,
                        }
                        : {
                            lat: parsedEndLat,
                            lng: parsedEndLng,
                        }
            );
        } catch (error) {
            console.error("안전 경로 조회 실패:", error);
            Alert.alert("경로 조회 실패", "안전 경로를 불러오는 중 문제가 발생했습니다.");
        } finally {
            setIsLoadingRoute(false);
        }
    }, [parsedEndLat, parsedEndLng, parsedStartLat, parsedStartLng]);

    useEffect(() => {
        loadSafeRoute();
    }, [loadSafeRoute]);

    const routeData = useMemo(() => {
        return {
            start: {
                lat: startMarker?.lat ?? parsedStartLat,
                lng: startMarker?.lng ?? parsedStartLng,
                name: startName,
            },
            end: {
                lat: endMarker?.lat ?? parsedEndLat,
                lng: endMarker?.lng ?? parsedEndLng,
                name: endName,
            },
            path,
        };
    }, [
        startMarker,
        endMarker,
        parsedStartLat,
        parsedStartLng,
        parsedEndLat,
        parsedEndLng,
        startName,
        endName,
        path,
    ]);

    const html = useMemo(() => {
        if (path.length === 0) {
            return "";
        }

        return createRouteMapHtml({
            appKey: KAKAO_JS_KEY,
            start: routeData.start,
            end: routeData.end,
            path: routeData.path,
        });
    }, [routeData, path]);

    if (isLoadingRoute) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (path.length === 0) {
        return (
            <View style={styles.loadingContainer} />
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                key={JSON.stringify(routeData)}
                ref={webViewRef}
                originWhitelist={["*"]}
                source={{ html }}
                javaScriptEnabled
                domStorageEnabled
                style={styles.map}
            />

            <View style={styles.overlay} pointerEvents="box-none">
                <View style={styles.topArea} pointerEvents="box-none">
                    <RouteTopSearchBar
                        startName={startName}
                        endName={endName}
                        onPressBack={() => router.back()}
                        onPressStart={() =>
                            router.push({
                                pathname: "/search/location",
                                params: { field: "start" },
                            })
                        }
                        onPressEnd={() =>
                            router.push({
                                pathname: "/search/location",
                                params: { field: "end" },
                            })
                        }
                    />
                </View>

                <View style={styles.bottomArea} pointerEvents="box-none">
                    <View style={styles.cardRow}>
                        <RouteOptionCard
                            selected={selectedType === "manual"}
                            title={ROUTE_OPTIONS.manual.title}
                            subtitle={ROUTE_OPTIONS.manual.subtitle}
                            duration={ROUTE_OPTIONS.manual.duration}
                            distance={ROUTE_OPTIONS.manual.distance}
                            onPress={() => setSelectedType("manual")}
                        />

                        <RouteOptionCard
                            selected={selectedType === "electric"}
                            title={ROUTE_OPTIONS.electric.title}
                            subtitle={ROUTE_OPTIONS.electric.subtitle}
                            duration={ROUTE_OPTIONS.electric.duration}
                            distance={ROUTE_OPTIONS.electric.distance}
                            onPress={() => setSelectedType("electric")}
                        />
                    </View>

                    <RouteBottomActionBar
                        onPressStartGuide={() => {
                            Alert.alert("안내 시작", "추후 안내 시작 기능과 연결할 예정입니다.");
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    map: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "space-between",
    },
    topArea: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    cardRow: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    bottomArea: {
        paddingBottom: 0,
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
});
