// 이 코드는 경로 검색 화면에서 출발지와 도착지 검색 결과를
// 이름과 좌표까지 함께 저장하고,
// 장소 검색 화면 이동 시 기존 출발지와 도착지 정보를 함께 전달하는 컴포넌트입니다.

import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
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

type SelectedPlace = {
    name: string;
    latitude: number;
    longitude: number;
};

export default function RouteSearchScreen() {
    const [start, setStart] = useState<SelectedPlace | null>(null);
    const [end, setEnd] = useState<SelectedPlace | null>(null);
    const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);

    const {
        startName,
        startLat,
        startLng,
        endName,
        endLat,
        endLng,
    } = useLocalSearchParams<{
        startName?: string;
        startLat?: string;
        startLng?: string;
        endName?: string;
        endLat?: string;
        endLng?: string;
    }>();

    // 라우트 파라미터로 전달된 출발지와 도착지 정보를 상태에 반영하는 함수
    useEffect(() => {
        if (startName && startLat && startLng) {
            const parsedStartLat = Number(startLat);
            const parsedStartLng = Number(startLng);

            if (!Number.isNaN(parsedStartLat) && !Number.isNaN(parsedStartLng)) {
                setStart({
                    name: startName,
                    latitude: parsedStartLat,
                    longitude: parsedStartLng,
                });
            }
        }

        if (endName && endLat && endLng) {
            const parsedEndLat = Number(endLat);
            const parsedEndLng = Number(endLng);

            if (!Number.isNaN(parsedEndLat) && !Number.isNaN(parsedEndLng)) {
                setEnd({
                    name: endName,
                    latitude: parsedEndLat,
                    longitude: parsedEndLng,
                });
            }
        }
    }, [startName, startLat, startLng, endName, endLat, endLng]);

    // 출발지 입력 카드를 눌렀을 때 장소 검색 화면으로 이동하는 함수
    const handlePressStart = () => {
        router.push({
            pathname: "/search/location",
            params: {
                field: "start",
                startName: start?.name ?? "",
                startLat: start ? String(start.latitude) : "",
                startLng: start ? String(start.longitude) : "",
                endName: end?.name ?? "",
                endLat: end ? String(end.latitude) : "",
                endLng: end ? String(end.longitude) : "",
            },
        });
    };

    // 도착지 입력 카드를 눌렀을 때 장소 검색 화면으로 이동하는 함수
    const handlePressEnd = () => {
        router.push({
            pathname: "/search/location",
            params: {
                field: "end",
                startName: start?.name ?? "",
                startLat: start ? String(start.latitude) : "",
                startLng: start ? String(start.longitude) : "",
                endName: end?.name ?? "",
                endLat: end ? String(end.latitude) : "",
                endLng: end ? String(end.longitude) : "",
            },
        });
    };

    // 현재 위치 권한을 요청하고 좌표를 받아온 뒤
    // 주소 변환 API를 호출하여 출발지 값과 현재 좌표를 설정하는 함수
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

            setStart({
                name: resolvedAddress.roadAddress ?? resolvedAddress.fullAddress,
                latitude,
                longitude,
            });
        } catch (error) {
            console.error("현재 위치 조회 실패:", error);
            Alert.alert("오류", "현재 위치를 불러오는 중 문제가 발생했습니다.");
        } finally {
            setIsLoadingCurrentLocation(false);
        }
    };

    // 출발지와 도착지 입력 여부를 확인한 뒤
    // 이름과 좌표 데이터를 함께 경로 검색 결과 화면으로 전달하는 함수
    const handleSearchRoute = () => {
        if (!start || !end) {
            Alert.alert("안내", "출발지와 도착지를 모두 입력해줘.");
            return;
        }

        router.push({
            pathname: "/route",
            params: {
                start: start.name,
                end: end.name,
                startLat: String(start.latitude),
                startLng: String(start.longitude),
                endLat: String(end.latitude),
                endLng: String(end.longitude),
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
                    value={start?.name ?? ""}
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
                    value={end?.name ?? ""}
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
                    setStart({
                        name: item.from,
                        latitude: 37.205413,
                        longitude: 127.063431,
                    });

                    setEnd({
                        name: item.to,
                        latitude: 37.2105,
                        longitude: 127.071,
                    });
                }}
            />

            <FavoritePlacesSection
                onPressItem={(item) => {
                    setEnd({
                        name: item.name,
                        latitude: 37.2105,
                        longitude: 127.071,
                    });
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