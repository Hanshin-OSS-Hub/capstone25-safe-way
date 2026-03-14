// 장애물 제보 페이지의 위치 미리보기 컴포넌트입니다. 실제 지도 대신 위치 아이콘과 텍스트로 현재 위치를 표시합니다. mock 데이터
import { StyleSheet, Text, View } from "react-native";
import { MapPin } from "lucide-react-native";

type LocationPreviewProps = {
    locationText: string;
};

export default function LocationPreview({
                                            locationText,
                                        }: LocationPreviewProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.label}>위치</Text>

            <View style={styles.mapBox}>
                <View style={styles.mapPattern} />
                <View style={styles.markerBadge}>
                    <MapPin size={20} color="#FFFFFF" />
                </View>
            </View>

            <View style={styles.locationInfo}>
                <MapPin size={16} color="#2563EB" />
                <Text style={styles.locationText}>현재 위치: {locationText}</Text>
            </View>
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
    mapBox: {
        height: 180,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    mapPattern: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#E5E7EB",
    },
    markerBadge: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: "#EF4444",
        alignItems: "center",
        justifyContent: "center",
    },
    locationInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    locationText: {
        fontSize: 14,
        color: "#374151",
        fontWeight: "500",
    },
});