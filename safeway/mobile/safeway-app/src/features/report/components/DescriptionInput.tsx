// 장애물 제보 페이지의 상세 설명 입력 컴포넌트
import { StyleSheet, Text, TextInput, View } from "react-native";

type DescriptionInputProps = {
    value: string;
    onChangeText: (text: string) => void;
};

export default function DescriptionInput({
                                             value,
                                             onChangeText,
                                         }: DescriptionInputProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.label}>상세 설명</Text>

            <TextInput
                style={styles.textArea}
                placeholder="장애물에 대한 상세한 설명을 입력해주세요."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                value={value}
                onChangeText={onChangeText}
            />

            <Text style={styles.helperText}>
                예) 위치, 주변 환경, 위험 요소 등
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#374151",
    },
    textArea: {
        minHeight: 140,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: "#111827",
        lineHeight: 22,
    },
    helperText: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 4,
    }
});