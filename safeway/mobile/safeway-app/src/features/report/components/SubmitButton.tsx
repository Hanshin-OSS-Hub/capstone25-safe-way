// 장애물 제보 페이지의 제보 등록 버튼 컴포넌트입니다.
import { Pressable, StyleSheet, Text } from "react-native";

type SubmitButtonProps = {
    onPress: () => void;
};

export default function SubmitButton({ onPress }: SubmitButtonProps) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>제보 등록</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 52,
        borderRadius: 16,
        backgroundColor: "#FACC15",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
});