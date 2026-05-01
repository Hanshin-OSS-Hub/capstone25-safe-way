// 이 코드는 Expo 위치 정보를 Kakao Map WebView로 전달해 현재 위치 마커를 실시간 갱신하는 화면 코드입니다.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

import { FALLBACK_LOCATION } from "@/src/features/map/constantsMap";
import { createKakaoMapHtml } from "@/src/features/map/utils/kakaoMapHtml";
import { KAKAO_JS_KEY } from "@/src/shared/constants/env";

type MapLocation = {
    latitude: number;
    longitude: number;
    name: string;
};

type LocationMessage = {
    type: "UPDATE_CURRENT_LOCATION";
    latitude: number;
    longitude: number;
    clearPolyline: true;
};

type CenterLocationMessage = {
    type: "CENTER_ON_CURRENT_LOCATION";
    latitude: number;
    longitude: number;
};

type MapMessage = LocationMessage | CenterLocationMessage;

const LOCATION_UPDATE_DISTANCE_METERS = 5;

// 두 좌표 사이의 직선 거리를 미터 단위로 계산하는 함수입니다.
function getDistanceMeters(from: MapLocation, to: MapLocation) {
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

// 위치 좌표를 화면에서 사용하는 현재 위치 객체로 변환하는 함수입니다.
function createCurrentLocation(latitude: number, longitude: number): MapLocation {
    return {
        latitude,
        longitude,
        name: "현재 위치",
    };
}

// 현재 위치 지도 화면을 렌더링하고 위치 변경을 WebView로 전달하는 컴포넌트입니다.
export default function CurrentLocationMapScreen() {
    const webViewRef = useRef<WebView>(null);
    const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
    const currentLocationRef = useRef<MapLocation>(FALLBACK_LOCATION);
    const lastSentLocationRef = useRef<MapLocation | null>(null);
    const pendingMapMessageRef = useRef<MapMessage | null>(null);
    const webViewLoadedRef = useRef(false);

    const [location, setLocation] = useState<MapLocation>(FALLBACK_LOCATION);
    const [loading, setLoading] = useState(true);

    // WebView가 준비된 경우 현재 위치 갱신 메시지를 전달하는 함수입니다.
    const postCurrentLocationToMap = useCallback((nextLocation: MapLocation) => {
        const message: LocationMessage = {
            type: "UPDATE_CURRENT_LOCATION",
            latitude: nextLocation.latitude,
            longitude: nextLocation.longitude,
            clearPolyline: true,
        };

        if (!webViewLoadedRef.current) {
            pendingMapMessageRef.current = message;
            return;
        }

        webViewRef.current?.postMessage(JSON.stringify(message));
    }, []);

    // 현재 위치 버튼을 눌렀을 때 WebView 지도 중심을 최신 현재 위치로 이동시키는 함수입니다.
    const handleCurrentLocationButtonPress = useCallback(() => {
        const currentLocation = currentLocationRef.current;
        const message: CenterLocationMessage = {
            type: "CENTER_ON_CURRENT_LOCATION",
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
        };

        if (!webViewLoadedRef.current) {
            pendingMapMessageRef.current = message;
            return;
        }

        webViewRef.current?.postMessage(JSON.stringify(message));
    }, []);

    // 이전 전송 좌표와 비교해 일정 거리 이상 이동했을 때만 WebView로 위치를 보내는 함수입니다.
    const updateCurrentLocation = useCallback(
        (nextLocation: MapLocation) => {
            const lastSentLocation = lastSentLocationRef.current;

            if (
                lastSentLocation &&
                getDistanceMeters(lastSentLocation, nextLocation) <
                    LOCATION_UPDATE_DISTANCE_METERS
            ) {
                return;
            }

            lastSentLocationRef.current = nextLocation;
            postCurrentLocationToMap(nextLocation);
        },
        [postCurrentLocationToMap],
    );

    // 위치 권한을 확인하고 최초 위치 로딩과 이후 위치 변경 구독을 시작하는 함수입니다.
    const loadCurrentLocation = useCallback(async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setLocation(FALLBACK_LOCATION);
                currentLocationRef.current = FALLBACK_LOCATION;
                lastSentLocationRef.current = FALLBACK_LOCATION;
                return;
            }

            const current = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const currentLocation = createCurrentLocation(
                current.coords.latitude,
                current.coords.longitude,
            );

            setLocation(currentLocation);
            currentLocationRef.current = currentLocation;
            lastSentLocationRef.current = currentLocation;

            locationSubscriptionRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: LOCATION_UPDATE_DISTANCE_METERS,
                },
                (next) => {
                    const nextLocation = createCurrentLocation(
                        next.coords.latitude,
                        next.coords.longitude,
                    );

                    currentLocationRef.current = nextLocation;
                    updateCurrentLocation(nextLocation);
                },
            );
        } catch {
            setLocation(FALLBACK_LOCATION);
            currentLocationRef.current = FALLBACK_LOCATION;
            lastSentLocationRef.current = FALLBACK_LOCATION;
        } finally {
            setLoading(false);
        }
    }, [updateCurrentLocation]);

    // 화면 진입 시 위치 구독을 시작하고 화면 이탈 시 구독을 해제하는 함수입니다.
    useEffect(() => {
        loadCurrentLocation();

        return () => {
            locationSubscriptionRef.current?.remove();
            locationSubscriptionRef.current = null;
        };
    }, [loadCurrentLocation]);

    // WebView 로딩 완료 후 대기 중인 현재 위치 메시지를 전달하는 함수입니다.
    const handleWebViewLoadEnd = useCallback(() => {
        webViewLoadedRef.current = true;

        if (pendingMapMessageRef.current) {
            webViewRef.current?.postMessage(JSON.stringify(pendingMapMessageRef.current));
            pendingMapMessageRef.current = null;
        }
    }, []);

    const html = useMemo(() => {
        return createKakaoMapHtml({
            appKey: KAKAO_JS_KEY,
            latitude: location.latitude,
            longitude: location.longitude,
            markerTitle: location.name,
        });
    }, [location]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                originWhitelist={["*"]}
                source={{ html }}
                javaScriptEnabled
                domStorageEnabled
                onLoadEnd={handleWebViewLoadEnd}
                style={styles.webview}
            />
            <Pressable
                accessibilityLabel="현재 위치로 이동"
                accessibilityRole="button"
                onPress={handleCurrentLocationButtonPress}
                style={styles.currentLocationButton}
            >
                <MaterialIcons name="my-location" size={24} color="#1F2937" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    currentLocationButton: {
        position: "absolute",
        right: 18,
        bottom: 20,
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
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
