// 이 코드는 메인 지도 탭에서 현재 위치 지도, 검색바, 빠른 접근 카드를 함께 보여주는 화면 코드입니다.
import { SafeAreaView, StyleSheet, View } from "react-native"
import CurrentLocationMapScreen from "@/src/features/map/screens/CurrentLocationMapScreen"
import { HomeSearchBar } from "@/src/features/home/components/HomeSearchBar"
import { HomeQuickCard } from "@/src/features/home/components/HomeQuickCard"

// 메인 지도 탭 화면을 렌더링하는 함수입니다.
export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <CurrentLocationMapScreen />

            <SafeAreaView pointerEvents="box-none" style={styles.overlay}>
                <View style={styles.overlayContent} pointerEvents="box-none">
                    <View style={styles.topArea} pointerEvents="box-none">
                        <HomeSearchBar />
                    </View>

                    <View style={styles.spacer} pointerEvents="box-none" />

                    <View style={styles.bottomArea} pointerEvents="box-none">
                        <HomeQuickCard />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        backgroundColor: "#F8FAFC",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 20,
    },
    overlayContent: {
        flex: 1,
    },
    topArea: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    spacer: {
        flex: 1,
    },
    bottomArea: {
        paddingHorizontal: 16,
        paddingBottom: 60,
    },
})
