import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
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

export default function CurrentLocationMapScreen() {
    const webViewRef = useRef<WebView>(null);

    const [location, setLocation] = useState<MapLocation>(FALLBACK_LOCATION);
    const [loading, setLoading] = useState(true);

    const loadCurrentLocation = useCallback(async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setLocation(FALLBACK_LOCATION);
                return;
            }

            const current = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setLocation({
                latitude: current.coords.latitude,
                longitude: current.coords.longitude,
                name: "현재 위치",
            });
        } catch (error) {
            setLocation(FALLBACK_LOCATION);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCurrentLocation();
    }, [loadCurrentLocation]);

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
                style={styles.webview}
            />
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
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});