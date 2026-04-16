// 이 코드는 즐겨찾기 카드에서 장소 아이콘을 감싸는 박스 컴포넌트 코드입니다.
import type { ReactNode } from "react"
import { StyleSheet, View } from "react-native"

type Props = {
    bg: string
    children: ReactNode
}

// 즐겨찾기 장소 아이콘을 배경색이 있는 정사각형 박스로 보여주는 함수입니다.
export default function FavoriteIconBox({ bg, children }: Props) {
    return <View style={[styles.iconBox, { backgroundColor: bg }]}>{children}</View>
}

const styles = StyleSheet.create({
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
})
