// 경로검색창의 최근 검색 섹션 컴포넌트

import { Pressable, StyleSheet, Text, View } from "react-native";
import { Clock3, ChevronRight } from "lucide-react-native";
import { RECENT_ROUTES_MOCK, type RecentRouteItem } from "../routeSearch.mock";

type Props = {
    onPressItem?: (item: RecentRouteItem) => void;
};

export default function RecentSearchSection({ onPressItem }: Props) {
    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Clock3 size={22} color="#4B5563" />
                <Text style={styles.title}>최근 검색</Text>
            </View>

            <View style={styles.list}>
                {RECENT_ROUTES_MOCK.map((item) => (
                    <Pressable
                        key={item.id}
                        style={({ pressed }) => [
                            styles.item,
                            pressed && styles.itemPressed,
                        ]}
                        onPress={() => onPressItem?.(item)}
                    >
                        <Text style={styles.itemText}>
                            {item.from} → {item.to}
                        </Text>
                        <ChevronRight size={20} color="#6B7280" />
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
    item: {
        minHeight: 60,
        borderRadius: 16,
        backgroundColor: "#EEF2F7",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 18,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemPressed: {
        opacity: 0.9,
    },
    itemText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#374151",
    },
});