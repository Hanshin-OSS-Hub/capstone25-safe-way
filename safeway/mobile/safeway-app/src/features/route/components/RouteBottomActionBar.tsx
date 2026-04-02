// 경로검색결과 > 하단 상세경로, 안내시작 버튼
import { Pressable, StyleSheet, Text, View } from "react-native";

type RouteBottomActionBarProps = {
    onPressStartGuide?: () => void;
};

export default function RouteBottomActionBar({
                                                 onPressStartGuide,
                                             }: RouteBottomActionBarProps) {
    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                ]}
                onPress={onPressStartGuide}
            >
                <Text style={styles.buttonText}>안내 시작</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#3B82F6",
    },
    button: {
        width: "100%",
        height: 68,
        backgroundColor: "#3B82F6",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonPressed: {
        opacity: 0.9,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.2,
    },
});