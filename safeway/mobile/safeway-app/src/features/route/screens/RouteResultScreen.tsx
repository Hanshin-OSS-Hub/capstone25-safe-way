// 이 코드는 경로 결과 화면에서 안전 경로를 조회하고 Kakao Map WebView에 경로, 현재 위치, 지도 제어 버튼을 렌더링하는 컴포넌트입니다.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";

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

type CurrentLocation = {
    latitude: number;
    longitude: number;
};

type UpdateCurrentLocationMessage = {
    type: "UPDATE_CURRENT_LOCATION";
    latitude: number;
    longitude: number;
};

type CenterCurrentLocationMessage = {
    type: "CENTER_ON_CURRENT_LOCATION";
    latitude: number;
    longitude: number;
};

type StartGuideMessage = {
    type: "START_GUIDE";
};

type RouteMapMessage =
    | UpdateCurrentLocationMessage
    | CenterCurrentLocationMessage
    | StartGuideMessage;

const LOCATION_UPDATE_DISTANCE_METERS = 5;

const ROUTE_OPTIONS = {
    manual: {
        title: "수동 휠체어",
        subtitle: "경사 우회 경로",
        duration: "24분",
        distance: "384m",
    },
    electric: {
        title: "전동 휠체어",
        subtitle: "이동시간 우선",
        duration: "18분",
        distance: "384m",
    },
};

// 두 좌표 사이의 직선 거리를 미터 단위로 계산하는 함수입니다.
function getDistanceMeters(from: CurrentLocation, to: CurrentLocation) {
    const earthRadiusMeters = 6371000;
    const fromLatitude = (from.latitude * Math.PI) / 180;
    const toLatitude = (to.latitude * Math.PI) / 180;
    const latitudeDelta = ((to.latitude - from.latitude) * Math.PI) / 180;
    const longitudeDelta = ((to.longitude - from.longitude) * Math.PI) / 180;

    const haversine =
        Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
        Math.cos(fromLatitude) *
            Math.cos(toLatitude) *
            Math.sin(longitudeDelta / 2) *
            Math.sin(longitudeDelta / 2);

    return (
        earthRadiusMeters *
        2 *
        Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
    );
}

// Expo Location 좌표를 현재 위치 메시지에서 사용하는 좌표 객체로 변환하는 함수입니다.
function createCurrentLocation(coords: Location.LocationObjectCoords): CurrentLocation {
    return {
        latitude: coords.latitude,
        longitude: coords.longitude,
    };
}

// 경로 결과 화면을 렌더링하고 Kakao Map WebView와 위치 메시지를 주고받는 컴포넌트입니다.
export default function RouteResultScreen() {
    const webViewRef = useRef<WebView>(null);
    const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
    const currentLocationRef = useRef<CurrentLocation | null>(null);
    const lastSentLocationRef = useRef<CurrentLocation | null>(null);
    const pendingMapMessageRef = useRef<RouteMapMessage | null>(null);
    const webViewLoadedRef = useRef(false);

    const [selectedType, setSelectedType] = useState<RouteOptionType>("electric");
    const [path, setPath] = useState<MapPathPoint[]>([]);
    const [isLoadingRoute, setIsLoadingRoute] = useState(true);
    const [startMarker, setStartMarker] = useState<MarkerPoint | null>(null);
    const [endMarker, setEndMarker] = useState<MarkerPoint | null>(null);
    const [isGuideStarted, setIsGuideStarted] = useState(false);
    const [initialCurrentLocation, setInitialCurrentLocation] =
        useState<CurrentLocation | null>(null);

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
        typeof start === "string" && start.trim().length > 0 ? start : "출발지";
    const endName =
        typeof end === "string" && end.trim().length > 0 ? end : "도착지";

    const parsedStartLat = Number(startLat);
    const parsedStartLng = Number(startLng);
    const parsedEndLat = Number(endLat);
    const parsedEndLng = Number(endLng);

    // WebView가 준비된 경우 경로 지도에 메시지를 전달하는 함수입니다.
    const postMessageToRouteMap = useCallback((message: RouteMapMessage) => {
        if (!webViewLoadedRef.current) {
            pendingMapMessageRef.current = message;
            return;
        }

        webViewRef.current?.postMessage(JSON.stringify(message));
    }, []);

    // 이전 전송 좌표와 비교해 일정 거리 이상 이동했을 때만 현재 위치 마커 갱신 메시지를 보내는 함수입니다.
    const updateCurrentLocationOnMap = useCallback(
        (nextLocation: CurrentLocation) => {
            const lastSentLocation = lastSentLocationRef.current;

            if (
                lastSentLocation &&
                getDistanceMeters(lastSentLocation, nextLocation) <
                    LOCATION_UPDATE_DISTANCE_METERS
            ) {
                return;
            }

            lastSentLocationRef.current = nextLocation;
            postMessageToRouteMap({
                type: "UPDATE_CURRENT_LOCATION",
                latitude: nextLocation.latitude,
                longitude: nextLocation.longitude,
            });
        },
        [postMessageToRouteMap],
    );

    // 현재 위치 버튼을 눌렀을 때 경로 지도 중심을 최신 현재 위치로 이동시키는 함수입니다.
    const handleCurrentLocationButtonPress = useCallback(() => {
        const currentLocation = currentLocationRef.current;

        if (!currentLocation) {
            return;
        }

        postMessageToRouteMap({
            type: "CENTER_ON_CURRENT_LOCATION",
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
        });
    }, [postMessageToRouteMap]);

    // 안내 시작 버튼을 눌렀을 때 경로 폴리라인 제거 메시지를 보내는 함수입니다.
    const handleStartGuidePress = useCallback(() => {
        setIsGuideStarted(true);
        postMessageToRouteMap({
            type: "START_GUIDE",
        });
    }, [postMessageToRouteMap]);

    // 위치 권한을 확인하고 경로 화면에서 현재 위치 변경 구독을 시작하는 함수입니다.
    const watchCurrentLocation = useCallback(async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                return;
            }

            const current = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            const currentLocation = createCurrentLocation(current.coords);

            currentLocationRef.current = currentLocation;
            lastSentLocationRef.current = currentLocation;
            setInitialCurrentLocation(currentLocation);

            locationSubscriptionRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: LOCATION_UPDATE_DISTANCE_METERS,
                },
                (next) => {
                    const nextLocation = createCurrentLocation(next.coords);

                    currentLocationRef.current = nextLocation;
                    updateCurrentLocationOnMap(nextLocation);
                },
            );
        } catch (error) {
            console.error("현재 위치 구독 실패:", error);
        }
    }, [updateCurrentLocationOnMap]);

    // WebView 로딩 완료 후 대기 중인 지도 메시지를 전달하는 함수입니다.
    const handleWebViewLoadEnd = useCallback(() => {
        webViewLoadedRef.current = true;

        if (pendingMapMessageRef.current) {
            webViewRef.current?.postMessage(JSON.stringify(pendingMapMessageRef.current));
            pendingMapMessageRef.current = null;
        }
    }, []);

    // 출발지와 도착지 좌표를 기준으로 노드 변환 및 안전 경로 조회를 수행하는 함수입니다.
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
                parsedStartLat,
            );
            const endNodeResult = await convertCoordinateToNode(
                parsedEndLng,
                parsedEndLat,
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
                endNodeResult.nodeId,
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
                        },
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
                        },
            );
        } catch (error) {
            console.error("안전 경로 조회 실패:", error);
            Alert.alert("경로 조회 실패", "안전 경로를 불러오는 중 문제가 발생했습니다.");
        } finally {
            setIsLoadingRoute(false);
        }
    }, [parsedEndLat, parsedEndLng, parsedStartLat, parsedStartLng]);

    // 화면 진입 시 안전 경로를 조회하는 함수입니다.
    useEffect(() => {
        loadSafeRoute();
    }, [loadSafeRoute]);

    // 화면 진입 시 현재 위치 구독을 시작하고 화면 이탈 시 구독을 해제하는 함수입니다.
    useEffect(() => {
        watchCurrentLocation();

        return () => {
            locationSubscriptionRef.current?.remove();
            locationSubscriptionRef.current = null;
        };
    }, [watchCurrentLocation]);

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
            currentLocation: initialCurrentLocation
                ? {
                    lat: initialCurrentLocation.latitude,
                    lng: initialCurrentLocation.longitude,
                }
                : undefined,
        };
    }, [
        startMarker,
        endMarker,
        initialCurrentLocation,
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
            currentLocation: routeData.currentLocation,
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
        return <View style={styles.loadingContainer} />;
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
                onLoadEnd={handleWebViewLoadEnd}
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

                {!isGuideStarted && (
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

                        <RouteBottomActionBar onPressStartGuide={handleStartGuidePress} />
                    </View>
                )}
            </View>

            <Pressable
                accessibilityLabel="현재 위치로 이동"
                accessibilityRole="button"
                onPress={handleCurrentLocationButtonPress}
                style={[
                    styles.currentLocationButton,
                    !isGuideStarted && styles.currentLocationButtonAboveActions,
                ]}
            >
                <MaterialIcons name="my-location" size={24} color="#1F2937" />
            </Pressable>
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
    currentLocationButton: {
        position: "absolute",
        right: 18,
        bottom: 28,
        width: 48,
        height: 48,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.18,
        shadowRadius: 5,
        elevation: 5,
    },
    currentLocationButtonAboveActions: {
        bottom: 200,
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
