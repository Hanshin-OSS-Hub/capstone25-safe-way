// 이 코드는 교통약자 서비스 카드에서 아이콘을 감싸는 박스 컴포넌트 코드입니다.
import type { ReactNode } from "react"
import { StyleSheet, View } from "react-native"

type Props = {
    bg: string
    children: ReactNode
}

// 서비스 아이콘을 배경색이 있는 정사각형 박스로 보여주는 함수입니다.
export default function IconBox({ bg, children }: Props) {
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
