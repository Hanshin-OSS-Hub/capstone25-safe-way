// 장애물 제보 페이지의 이미지 선택 박스
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageUp } from "lucide-react-native";

type ImageUploadBoxProps = {
    imageUri: string | null;
    onChangeImage: (uri: string) => void;
};

export default function ImageUploadBox({
                                           imageUri,
                                           onChangeImage,
                                       }: ImageUploadBoxProps) {
    const handlePickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("권한 필요", "사진 업로드를 위해 갤러리 접근 권한이 필요합니다.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            onChangeImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.section}>
            <Text style={styles.label}>사진 업로드</Text>

            <Pressable style={styles.uploadBox} onPress={handlePickImage}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                ) : (
                    <View style={styles.placeholder}>
                        <View style={styles.iconBadge}>
                            <ImageUp size={20} color="#2563EB" />
                        </View>
                        <Text style={styles.placeholderTitle}>사진을 업로드하세요</Text>
                        <Text style={styles.placeholderDescription}>
                            장애물이 잘 보이도록 촬영한 사진을 첨부해주세요.
                        </Text>
                    </View>
                )}
            </Pressable>
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
    uploadBox: {
        minHeight: 210,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    placeholder: {
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    iconBadge: {
        width: 42,
        height: 42,
        borderRadius: 999,
        backgroundColor: "#EFF6FF",
        alignItems: "center",
        justifyContent: "center",
    },
    placeholderTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1F2937",
    },
    placeholderDescription: {
        fontSize: 13,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 18,
    },
    previewImage: {
        width: "100%",
        height: 210,
        borderRadius: 12,
    },
});