// 이 코드는 즐겨찾기 장소의 제목, 태그, 주소를 카드 형태로 보여주는 컴포넌트 코드입니다.
import type { ReactNode } from "react"
import { StyleSheet, Text, View } from "react-native"
import { ChevronRight, MapPin } from "lucide-react-native"

type Props = {
    icon: ReactNode
    title: string
    tag: string
    address: string
}

// 즐겨찾기 장소 한 개를 카드 형태로 렌더링하는 함수입니다.
export default function FavoriteCard({ icon, title, tag, address }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.leftArea}>
                {icon}

                <View style={styles.textArea}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={styles.tagBadge}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    </View>

                    <View style={styles.addressRow}>
                        <MapPin size={14} color="#9CA3AF" />
                        <Text style={styles.address} numberOfLines={1}>
                            {address}
                        </Text>
                    </View>
                </View>
            </View>

            <ChevronRight size={20} color="#9CA3AF" />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        marginBottom: 1,
        backgroundColor: "white",
        borderRadius: 16,
        shadowColor: "#0F172A",
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    leftArea: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    textArea: {
        flex: 1,
        gap: 6,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        color: "#111827",
    },
    tagBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: "#EFF6FF",
    },
    tagText: {
        fontSize: 12,
        color: "#2563EB",
        fontWeight: "500",
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    address: {
        flex: 1,
        fontSize: 14,
        color: "#6B7280",
    },
})
