// 이 코드는 교통약자 서비스 항목을 카드 형태로 보여주는 컴포넌트 코드입니다.
import type { ReactNode } from "react"
import { StyleSheet, Text, View } from "react-native"
import { ChevronRight } from "lucide-react-native"

type Props = {
    icon: ReactNode
    title: string
}

// 서비스 한 개를 아이콘, 제목, 오른쪽 화살표가 있는 카드로 렌더링하는 함수입니다.
export default function ServiceCard({ icon, title }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.leftArea}>
                {icon}
                <Text style={styles.title}>{title}</Text>
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
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        color: "#111827",
    },
})
