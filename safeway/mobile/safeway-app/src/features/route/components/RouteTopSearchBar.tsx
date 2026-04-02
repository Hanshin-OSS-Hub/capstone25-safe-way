// 경로검색결과창 > 상단 검색바 컴포넌트
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ChevronRight } from "lucide-react-native";

type RouteTopSearchBarProps = {
    startName: string;
    endName: string;
    onPressBack: () => void;
    onPressStart: () => void;
    onPressEnd: () => void;
};

export default function RouteTopSearchBar({
                                              startName,
                                              endName,
                                              onPressBack,
                                              onPressStart,
                                              onPressEnd,
                                          }: RouteTopSearchBarProps) {
    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    <Pressable onPress={onPressBack} style={styles.backButton}>
                        <ArrowLeft size={22} color="#374151" />
                    </Pressable>

                    <View style={styles.routeBox}>
                        <Pressable style={styles.placeButton} onPress={onPressStart}>
                            <Text style={styles.placeText} numberOfLines={1}>
                                {startName}
                            </Text>
                        </Pressable>

                        <View style={styles.chevronWrapper}>
                            <ChevronRight size={18} color="#9CA3AF" />
                        </View>

                        <Pressable style={styles.placeButton} onPress={onPressEnd}>
                            <Text style={styles.placeText} numberOfLines={1}>
                                {endName}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "transparent",
    },
    wrapper: {
        paddingHorizontal: 10,
        paddingTop: 8,
    },
    container: {
        minHeight: 64,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.96)",
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 4,
    },
    routeBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        minHeight: 44,
    },
    placeButton: {
        flex: 1,
        minHeight: 44,
        borderRadius: 14,
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    chevronWrapper: {
        width: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    placeText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
        lineHeight: 20,
    },
});