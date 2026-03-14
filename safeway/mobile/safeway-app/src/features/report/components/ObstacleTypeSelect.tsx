// 장애물 제보 페이지의 장애물 유형 선택 컴포넌트
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { OBSTACLE_TYPES } from "../constants";
import { ObstacleType } from "../types";
import { useState } from "react";

type ObstacleTypeSelectProps = {
    selectedType: ObstacleType;
    onChangeType: (type: ObstacleType) => void;
};

export default function ObstacleTypeSelect({
                                               selectedType,
                                               onChangeType,
                                           }: ObstacleTypeSelectProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <View style={styles.section}>
            <Text style={styles.label}>장애물 유형</Text>

            <Pressable
                style={styles.selectBox}
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.selectText}>{selectedType}</Text>
                <ChevronDown size={20} color="#9CA3AF" />
            </Pressable>

            <Modal
                transparent
                animationType="fade"
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>장애물 유형 선택</Text>

                        {OBSTACLE_TYPES.map((type) => (
                            <Pressable
                                key={type}
                                style={styles.modalItem}
                                onPress={() => {
                                    onChangeType(type);
                                    setIsModalVisible(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        selectedType === type && styles.modalItemTextSelected,
                                    ]}
                                >
                                    {type}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#374151",
    },
    selectBox: {
        height: 52,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    selectText: {
        fontSize: 15,
        color: "#111827",
        fontWeight: "500",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    modalCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 12,
    },
    modalItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    modalItemText: {
        fontSize: 16,
        color: "#374151",
    },
    modalItemTextSelected: {
        fontWeight: "700",
        color: "#111827",
    },
});