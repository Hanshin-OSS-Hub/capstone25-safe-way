// 경로검색창의 출발지 / 도착지 입력 카드 컴포넌트

import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";

type Props = {
    label: string;
    value?: string;
    icon: ReactNode;
    borderColor: string;
    onPress?: () => void;
    rightSlot?: ReactNode;
};

export default function LocationInputCard({
                                              label,
                                              value,
                                              icon,
                                              borderColor,
                                              onPress,
                                              rightSlot,
                                          }: Props) {
    return (
        <Pressable
            style={[styles.container, { borderColor }]}
            onPress={onPress}
        >
            <View style={styles.leftSection}>
                <View style={styles.iconWrapper}>{icon}</View>
                <Text style={[styles.label, value ? styles.valueText : styles.placeholderText]}>
                    {value || label}
                </Text>
            </View>

            {rightSlot ? <View>{rightSlot}</View> : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 65,
        borderRadius: 18,
        borderWidth: 1.5,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontSize: 16,
    },
    placeholderText: {
        color: "#9CA3AF",
    },
    valueText: {
        color: "#111827",
        fontWeight: "600",
    },
});