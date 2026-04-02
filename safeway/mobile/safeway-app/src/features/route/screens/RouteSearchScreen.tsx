// 경로검색창 구현 컴포넌트

import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router } from "expo-router";
import {
    ArrowLeft,
    MapPin,
    Navigation,
} from "lucide-react-native";

import LocationInputCard from "../components/LocationInputCard";
import RecentSearchSection from "../components/RecentSearchSection";
import FavoritePlacesSection from "../components/FavoritePlacesSection";

export default function RouteSearchScreen() {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const handlePressStart = () => {
        /**
         * TODO:
         * 추후 장소 검색 페이지 연결
         * ex) router.push("/search/location?field=start")
         */
        Alert.alert("출발지 입력", "추후 장소 검색 화면과 연결할 예정이야.");
    };

    const handlePressEnd = () => {
        /**
         * TODO:
         * 추후 장소 검색 페이지 연결
         * ex) router.push("/search/location?field=end")
         */
        Alert.alert("도착지 입력", "추후 장소 검색 화면과 연결할 예정이야.");
    };

    const handleUseCurrentLocation = () => {
        /**
         * TODO:
         * 추후 위치 권한 요청 + 현재 위치 좌표 조회 후
         * 출발지 값 자동 설정
         */
        setStart("현재 위치");
    };

    const handleSearchRoute = () => {
        if (!start || !end) {
            Alert.alert("안내", "출발지와 도착지를 모두 입력해줘.");
            return;
        }

        router.push({
            pathname: "/route",
            params: {
                start,
                end,
            },
        });
    };

    return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <ArrowLeft size={24} color="#374151" />
                    </Pressable>
                    <Text style={styles.headerTitle}>경로 검색</Text>
                </View>

                <View style={styles.formSection}>
                    <LocationInputCard
                        label="출발지 입력"
                        value={start}
                        borderColor="#93C5FD"
                        onPress={handlePressStart}
                        icon={
                            <View style={[styles.circleIcon, { backgroundColor: "#3B82F6" }]}>
                                <MapPin size={18} color="#FFFFFF" />
                            </View>
                        }
                        rightSlot={
                            <Pressable
                                style={styles.currentLocationButton}
                                onPress={handleUseCurrentLocation}
                            >
                                <Text style={styles.currentLocationText}>현재 위치</Text>
                            </Pressable>
                        }
                    />

                    <LocationInputCard
                        label="도착지 입력"
                        value={end}
                        borderColor="#FBBF24"
                        onPress={handlePressEnd}
                        icon={
                            <View style={[styles.circleIcon, { backgroundColor: "#EAB308" }]}>
                                <Navigation size={18} color="#FFFFFF" />
                            </View>
                        }
                    />

                    <Pressable style={styles.searchButton} onPress={handleSearchRoute}>
                        <Text style={styles.searchButtonText}>경로 찾기</Text>
                    </Pressable>
                </View>

                <RecentSearchSection
                    onPressItem={(item) => {
                        setStart(item.from);
                        setEnd(item.to);
                    }}
                />

                <FavoritePlacesSection
                    onPressItem={(item) => {
                        /**
                         * TODO:
                         * 추후 즐겨찾기 선택 시 출발/도착지 어느 쪽에 넣을지
                         * 선택 바텀시트 or 상세 흐름 추가 가능
                         */
                        setEnd(item.name);
                    }}
                />
            </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 20,
        gap: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    backButton: {
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
    },
    formSection: {
        gap: 14,
    },
    circleIcon: {
        width: 40,
        height: 40,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    currentLocationButton: {
        backgroundColor: "#EFF6FF",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
    },
    currentLocationText: {
        color: "#2563EB",
        fontSize: 13,
        fontWeight: "700",
    },
    searchButton: {
        height: 52,
        borderRadius: 16,
        backgroundColor: "#FACC15",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },

    searchButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
});