import { useMemo, useRef, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
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

type RouteOptionType = "manual" | "electric";

const ROUTE_OPTIONS = {
    manual: {
        title: "수동 휠체어",
        subtitle: "경사 낮은 경로",
        duration: "24분",
        distance: "2.8km",
    },
    electric: {
        title: "전기 휠체어",
        subtitle: "이동시간 우선",
        duration: "18분",
        distance: "2.8km",
    },
};

export default function RouteResultScreen() {
    const webViewRef = useRef<WebView>(null);
    const [selectedType, setSelectedType] = useState<RouteOptionType>("electric");

    const { start, end } = useLocalSearchParams<{
        start?: string;
        end?: string;
    }>();

    const startName =
        typeof start === "string" && start.trim().length > 0
            ? start
            : "출발지";

    const endName =
        typeof end === "string" && end.trim().length > 0
            ? end
            : "도착지";

    const routeData = useMemo(() => {
        return {
            start: {
                lat: 37.2073,
                lng: 127.0337,
                name: startName,
            },
            end: {
                lat: 37.2641,
                lng: 126.9981,
                name: endName,
            },
            path: [
                { lat: 37.2073, lng: 127.0337 },
                { lat: 37.2082, lng: 127.0295 },
                { lat: 37.2103, lng: 127.0201 },
                { lat: 37.2184, lng: 127.0107 },
                { lat: 37.2295, lng: 127.0001 },
                { lat: 37.2411, lng: 126.9954 },
                { lat: 37.2534, lng: 126.9966 },
                { lat: 37.2641, lng: 126.9981 },
            ],
        };
    }, [startName, endName]);

    const html = useMemo(() => {
        return createRouteMapHtml({
            appKey: KAKAO_JS_KEY,
            start: routeData.start,
            end: routeData.end,
            path: routeData.path,
        });
    }, [routeData]);

    return (
        <View style={styles.container}>
            <WebView
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
                            Alert.alert("안내 시작", "추후 안내 시작 기능과 연결할 예정이야.");
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
    cardList: {
        paddingHorizontal: 16,
        gap: 12,
        paddingBottom: 14,
    },
});