// 이 코드는 장소 검색 화면에서 검색어를 입력받아 장소 검색 API를 호출하고,
// 검색 결과를 카테고리에 따라 다른 아이콘과 함께 리스트 형태로 보여주는 컴포넌트입니다.
// 선택한 장소 정보는 기존 출발지/도착지 값을 유지한 채 경로 검색 화면으로 전달합니다.

import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
    ArrowLeft,
    Bus,
    CircleX,
    Cross,
    GraduationCap,
    MapPin,
    Pill,
    ShoppingBag,
    Store,
    TrainFront,
    Utensils,
    Building2,
    Coffee,
} from "lucide-react-native";

import {
    searchPlaces,
    type SearchPlaceItem,
} from "@/src/features/route/api/searchApi";

// 장소 카테고리 문자열에 따라 좌측 아이콘을 반환하는 함수
function getPlaceIcon(categoryName: string) {
    const normalizedCategory = categoryName.toLowerCase();

    if (
        normalizedCategory.includes("지하철") ||
        normalizedCategory.includes("전철") ||
        normalizedCategory.includes("철도")
    ) {
        return <TrainFront size={21} color="#6B7280" strokeWidth={2.2} />;
    }

    if (
        normalizedCategory.includes("버스") ||
        normalizedCategory.includes("정류장")
    ) {
        return <Bus size={21} color="#6B7280" strokeWidth={2.2} />;
    }

    if (
        normalizedCategory.includes("병원") ||
        normalizedCategory.includes("의원") ||
        normalizedCategory.includes("의료") ||
        normalizedCategory.includes("정형외과") ||
        normalizedCategory.includes("내과") ||
        normalizedCategory.includes("치과")
    ) {
        return <Cross size={20} color="#6B7280" strokeWidth={2.2} />;
    }

    if (
        normalizedCategory.includes("약국")
    ) {
        return <Pill size={20} color="#6B7280" strokeWidth={2.2} />;
    }

    if (
        normalizedCategory.includes("학교") ||
        normalizedCategory.includes("대학교") ||
        normalizedCategory.includes("유치원") ||
        normalizedCategory.includes("학원")
    ) {
        return <GraduationCap size={20} color="#6B7280" strokeWidth={2.2} />;
    }

    if (
        normalizedCategory.includes("카페") ||
        normalizedCategory.includes("커피")
    ) {
        return <Coffee size={20} color="#6B7280" strokeWidth={2.2} />;
    }

    if (
        normalizedCategory.includes("음식점") ||
        normalizedCategory.includes("식당") ||
        normalizedCategory.includes("분식") ||
        normalizedCategory.includes("치킨") ||
        normalizedCategory.includes("햄버거") ||
        normalizedCategory.includes("중국집") ||
        normalizedCategory.includes("한식") ||
        normalizedCategory.includes("일식")
    ) {
        return <Utensils size={20} color="#6B7280" strokeWidth={2.2} />;
    }

    if (
        normalizedCategory.includes("편의점") ||
        normalizedCategory.includes("마트") ||
        normalizedCategory.includes("쇼핑") ||
        normalizedCategory.includes("백화점")
    ) {
        return <ShoppingBag size={20} color="#6B7280" strokeWidth={2.2} />;
    }

    if (
        normalizedCategory.includes("상가") ||
        normalizedCategory.includes("매장") ||
        normalizedCategory.includes("가게")
    ) {
        return <Store size={20} color="#6B7280" strokeWidth={2.2} />;
    }

    if (
        normalizedCategory.includes("아파트") ||
        normalizedCategory.includes("오피스텔") ||
        normalizedCategory.includes("빌라") ||
        normalizedCategory.includes("주택")
    ) {
        return <Building2 size={20} color="#6B7280" strokeWidth={2.2} />;
    }

    return <MapPin size={20} color="#6B7280" strokeWidth={2.2} />;
}

// 검색 결과 아이템의 주소 표시 문자열을 반환하는 함수
function getDisplayAddress(item: SearchPlaceItem): string {
    if (item.roadAddressName && item.roadAddressName.trim().length > 0) {
        return item.roadAddressName;
    }

    return item.addressName;
}

// 검색 결과 아이템의 카테고리 표시 문자열을 반환하는 함수
function getDisplayCategory(categoryName: string): string {
    const lastCategory = categoryName.split(">").pop()?.trim() ?? "";

    if (lastCategory.length > 0) {
        return lastCategory;
    }

    return categoryName;
}

export default function LocationSearchScreen() {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<SearchPlaceItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        field,
        startName,
        startLat,
        startLng,
        endName,
        endLat,
        endLng,
    } = useLocalSearchParams<{
        field?: string;
        startName?: string;
        startLat?: string;
        startLng?: string;
        endName?: string;
        endLat?: string;
        endLng?: string;
    }>();

    // 검색어를 기반으로 장소 검색 API를 호출하는 함수
    const handleSearch = async () => {
        if (!keyword.trim()) {
            return;
        }

        try {
            setIsLoading(true);

            const searchedPlaces = await searchPlaces(keyword.trim());
            setResults(searchedPlaces);
        } catch (error) {
            console.error("장소 검색 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 검색창 입력값과 검색 결과를 초기화하는 함수
    const handleClearKeyword = () => {
        setKeyword("");
        setResults([]);
    };

    // 선택한 장소 정보를 기존 출발지와 도착지 값에 반영하여 경로 검색 화면으로 전달하는 함수
    const handleSelectPlace = (item: SearchPlaceItem) => {
        const nextStartName = field === "start" ? item.placeName : startName ?? "";
        const nextStartLat = field === "start" ? item.lat : startLat ?? "";
        const nextStartLng = field === "start" ? item.lon : startLng ?? "";

        const nextEndName = field === "end" ? item.placeName : endName ?? "";
        const nextEndLat = field === "end" ? item.lat : endLat ?? "";
        const nextEndLng = field === "end" ? item.lon : endLng ?? "";

        router.replace({
            pathname: "/search",
            params: {
                startName: nextStartName,
                startLat: nextStartLat,
                startLng: nextStartLng,
                endName: nextEndName,
                endLat: nextEndLat,
                endLng: nextEndLng,
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBarWrapper}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={27} color="#374151" />
                </Pressable>

                <TextInput
                    value={keyword}
                    onChangeText={setKeyword}
                    placeholder="장소 검색"
                    placeholderTextColor="#9CA3AF"
                    style={styles.searchInput}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />

                <Pressable
                    style={styles.clearButton}
                    onPress={handleClearKeyword}
                    disabled={!keyword}
                >
                    <CircleX
                        size={20}
                        color={keyword ? "#D1D5DB" : "transparent"}
                        fill={keyword ? "#E5E7EB" : "transparent"}
                    />
                </Pressable>
            </View>

            {isLoading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color="#6B7280" />
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item, index) =>
                        `${item.placeName}-${item.lat}-${item.lon}-${index}`
                    }
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.resultItem}
                            onPress={() => handleSelectPlace(item)}
                        >
                            <View style={styles.iconWrapper}>
                                {getPlaceIcon(item.categoryName)}
                            </View>

                            <View style={styles.textContent}>
                                <View style={styles.titleRow}>
                                    <Text
                                        style={styles.placeName}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {item.placeName}
                                    </Text>

                                    <Text
                                        style={styles.categoryInline}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {getDisplayCategory(item.categoryName)}
                                    </Text>
                                </View>

                                <Text
                                    style={styles.addressText}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {getDisplayAddress(item)}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                    ListEmptyComponent={
                        keyword.trim().length > 0 ? (
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                            </View>
                        ) : null
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        paddingTop: 12,
    },
    searchBarWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        height: 60,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 18,
        paddingHorizontal: 10,
        shadowColor: "#111827",
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    backButton: {
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
    },
    searchInput: {
        flex: 1,
        fontSize: 17,
        color: "#111827",
        paddingHorizontal: 6,
    },
    clearButton: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    listContent: {
        paddingTop: 14,
        paddingBottom: 24,
    },
    resultItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    iconWrapper: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#EDEFF2",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
        marginTop: 2,
    },
    textContent: {
        flex: 1,
        gap: 5,
        paddingRight: 4,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    placeName: {
        flexShrink: 1,
        fontSize: 17,
        lineHeight: 23,
        fontWeight: "700",
        color: "#111827",
    },
    categoryInline: {
        flexShrink: 1,
        fontSize: 14,
        lineHeight: 20,
        color: "#9CA3AF",
    },
    addressText: {
        fontSize: 14,
        lineHeight: 20,
        color: "#6B7280",
    },
    emptyBox: {
        paddingTop: 40,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 15,
        color: "#6B7280",
    },
});