// 이 코드는 즐겨찾기 화면의 제목, 설명, 오른쪽 액션 영역을 보여주는 헤더 컴포넌트 코드입니다.
import type { ReactNode } from "react"
import { StyleSheet, Text, View } from "react-native"

type Props = {
    title: string
    description?: string
    rightElement?: ReactNode
}

// 즐겨찾기 화면 상단 헤더를 렌더링하는 함수입니다.
export default function FavoritesHeader({ title, description, rightElement }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.textArea}>
                <Text style={styles.title}>{title}</Text>
                {description ? <Text style={styles.description}>{description}</Text> : null}
            </View>

            {rightElement}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    textArea: {
        flex: 1,
        paddingRight: 12,
        gap: 6,
    },
    title: {
        marginTop: 4,
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
    },
    description: {
        marginBottom: 8,
        fontSize: 14,
        color: "#6B7280",
    },
})
