// 경로검색창의 즐겨찾기 장소 섹션 컴포넌트

import { Pressable, StyleSheet, Text, View } from "react-native";
import { Star } from "lucide-react-native";
import { FAVORITE_PLACES_MOCK, type FavoritePlaceItem } from "../routeSearch.mock";

type Props = {
    onPressItem?: (item: FavoritePlaceItem) => void;
};

export default function FavoritePlacesSection({ onPressItem }: Props) {
    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Star size={22} color="#4B5563" />
                <Text style={styles.title}>즐겨찾기</Text>
            </View>

            <View style={styles.list}>
                {FAVORITE_PLACES_MOCK.map((item) => (
                    <Pressable
                        key={item.id}
                        style={styles.card}
                        onPress={() => onPressItem?.(item)}
                    >
                        <Text style={styles.emoji}>{item.emoji}</Text>

                        <View style={styles.textWrapper}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.address}>{item.address}</Text>
                        </View>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 14,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1F2937",
    },
    list: {
        gap: 12,
    },
    card: {
        minHeight: 64,
        borderRadius: 18,
        backgroundColor: "#EAF1FB",
        paddingHorizontal: 18,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    emoji: {
        fontSize: 22,
    },
    textWrapper: {
        flex: 1,
    },
    name: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
        color: "#6B7280",
    },
});