// 이 코드는 탭 내부 스택 화면에 공통 안전영역과 배경색을 적용하는 레이아웃 코드입니다.
import { Stack } from "expo-router"
import { StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { APP_BG } from "@/src/shared/constants/backgroundColor"

// 탭 내부 Stack 화면을 공통 배경과 상단 안전영역 안에 렌더링하는 함수입니다.
export default function AppStackLayout() {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "transparent" },
                    }}
                />
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_BG,
    },
    safeArea: {
        flex: 1,
    },
})
