// 이 코드는 메인 화면에서 출발지와 목적지 검색 화면으로 이동하는 검색바 컴포넌트 코드입니다.
import { Pressable, StyleSheet, Text, View } from "react-native"
import { Accessibility, Search } from "lucide-react-native"
import { useRouter } from "expo-router"

// 검색바를 누르면 검색 화면으로 이동시키는 함수형 컴포넌트입니다.
export function HomeSearchBar() {
    const router = useRouter()

    // 검색 화면으로 이동하는 함수입니다.
    const handlePress = () => {
        router.push("/search")
    }

    return (
        <Pressable onPress={handlePress}>
            <View style={styles.container}>
                <View style={styles.logoBox}>
                    <Accessibility color="white" size={21} />
                </View>

                <View style={styles.textArea}>
                    <Text style={styles.placeholder}>출발지 또는 목적지를 입력해 주세요</Text>
                </View>

                <View style={styles.searchIconBox}>
                    <Search color="#2563EB" size={18} />
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "rgba(255,255,255,0.96)",
        shadowColor: "#0F172A",
        shadowOpacity: 0.08,
        shadowRadius: 16,
    },
    logoBox: {
        width: 46,
        height: 46,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2563EB",
    },
    textArea: {
        flex: 1,
    },
    placeholder: {
        fontSize: 15,
        color: "#94A3B8",
        fontWeight: "500",
    },
    searchIconBox: {
        width: 42,
        height: 42,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FAFC",
    },
})
