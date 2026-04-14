// 이 코드는 경로 검색 화면에서 현재 위치 버튼을 눌렀을 때
// 위치 권한 요청, 현재 좌표 조회, 주소 변환 API 호출을 통해
// 출발지 입력값을 현재 주소로 설정하는 컴포넌트입니다.

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
import * as Location from "expo-location";

import LocationInputCard from "../components/LocationInputCard";
import RecentSearchSection from "../components/RecentSearchSection";
import FavoritePlacesSection from "../components/FavoritePlacesSection";
import { getAddressByCoordinate } from "@/src/features/location/api/locationApi";

export default function RouteSearchScreen() {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);

    // 출발지 입력 카드를 눌렀을 때 실행되는 함수
    const handlePressStart = () => {
        /**
         * TODO:
         * 추후 장소 검색 페이지 연결
         * ex) router.push("/search/location?field=start")
         */
        Alert.alert("출발지 입력", "추후 장소 검색 화면과 연결할 예정입니다.");
    };

    // 도착지 입력 카드를 눌렀을 때 실행되는 함수
    const handlePressEnd = () => {
        /**
         * TODO:
         * 추후 장소 검색 페이지 연결
         * ex) router.push("/search/location?field=end")
         */
        Alert.alert("도착지 입력", "추후 장소 검색 화면과 연결할 예정입니다.");
    };

    // 현재 위치 권한을 요청하고 좌표를 받아온 뒤
    // 주소 변환 API를 호출하여 출발지 값을 설정하는 함수
    const handleUseCurrentLocation = async () => {
        try {
            setIsLoadingCurrentLocation(true);

            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                Alert.alert("위치 권한 필요", "현재 위치를 사용하려면 위치 권한 허용이 필요합니다.");
                return;
            }

            const currentPosition = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const latitude = currentPosition.coords.latitude;
            const longitude = currentPosition.coords.longitude;

            const resolvedAddress = await getAddressByCoordinate(longitude, latitude);

            if (!resolvedAddress) {
                Alert.alert("안내", "현재 위치의 주소를 찾지 못했습니다.");
                return;
            }

            setStart(resolvedAddress.roadAddress ?? resolvedAddress.fullAddress);
        } catch (error) {
            console.error("현재 위치 조회 실패:", error);
            Alert.alert("오류", "현재 위치를 불러오는 중 문제가 발생했습니다.");
        } finally {
            setIsLoadingCurrentLocation(false);
        }
    };

    // 출발지와 도착지 입력 여부를 확인한 뒤 경로 검색 결과 화면으로 이동하는 함수
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
                            style={[
                                styles.currentLocationButton,
                                isLoadingCurrentLocation && styles.currentLocationButtonDisabled,
                            ]}
                            onPress={handleUseCurrentLocation}
                            disabled={isLoadingCurrentLocation}
                        >
                            <Text style={styles.currentLocationText}>
                                {isLoadingCurrentLocation ? "불러오는 중..." : "현재 위치"}
                            </Text>
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
                     * 선택 바텀시트 또는 상세 흐름 추가 가능
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
    currentLocationButtonDisabled: {
        opacity: 0.6,
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