// 경로검색결과 > 하단 경로 옵션 카드 컴포넌트
import { Pressable, StyleSheet, Text, View } from "react-native";

type RouteOptionCardProps = {
    selected: boolean;
    title: string;
    subtitle: string;
    duration: string;
    distance: string;
    onPress: () => void;
};

export default function RouteOptionCard({
                                            selected,
                                            title,
                                            subtitle,
                                            duration,
                                            distance,
                                            onPress,
                                        }: RouteOptionCardProps) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.card,
                selected ? styles.cardSelected : styles.cardUnselected,
            ]}
        >
            <View style={styles.topRow}>
                <View style={styles.titleBlock}>
                    <View
                        style={[
                            styles.statusDot,
                            selected && styles.statusDotSelected,
                        ]}
                    />
                    <Text style={styles.title}>{title}</Text>
                </View>
            </View>

            <Text
                style={[
                    styles.subtitle,
                    selected && styles.subtitleSelected,
                ]}
            >
                {subtitle}
            </Text>

            <View style={styles.infoRow}>
                <Text style={styles.duration}>{duration}</Text>
                <Text style={styles.distance}>{distance}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        height: 112,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 13,
        justifyContent: "space-between",
    },

    cardUnselected: {
        backgroundColor: "rgba(255,255,255,0.94)",
        borderWidth: 1,
        borderColor: "rgba(229,231,235,0.9)",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },

    cardSelected: {
        backgroundColor: "#F8FBFF",
        borderWidth: 1.5,
        borderColor: "#BFDBFE",
        shadowColor: "#2563EB",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    titleBlock: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        flex: 1,
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 999,
        backgroundColor: "#D1D5DB",
    },

    statusDotSelected: {
        backgroundColor: "#3B82F6",
    },

    title: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
    },

    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: "#DBEAFE",
    },

    badgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#1D4ED8",
    },

    subtitle: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },

    subtitleSelected: {
        color: "#334155",
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },

    duration: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
    },

    distance: {
        fontSize: 13,
        color: "#6B7280",
    },
});