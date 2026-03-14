// 장애물 제보 페이지
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import ImageUploadBox from "@/src/features/report/components/ImageUploadBox";
import ObstacleTypeSelect from "@/src/features/report/components/ObstacleTypeSelect";
import DescriptionInput from "@/src/features/report/components/DescriptionInput";
import LocationPreview from "@/src/features/report/components/LocationPreview";
import SubmitButton from "@/src/features/report/components/SubmitButton";
import { ObstacleType } from "@/src/features/report/types";

export default function ObstacleReportScreen() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<ObstacleType>("단차");
    const [description, setDescription] = useState("");

    const currentLocationText = "오산시 양산동";

    const handleSubmit = () => {
        if (!imageUri) {
            Alert.alert("사진 업로드", "장애물 사진을 업로드해주세요.");
            return;
        }

        Alert.alert(
            "제보 등록",
            `사진: 업로드됨\n유형: ${selectedType}\n설명: ${
                description || "(없음)"
            }\n위치: ${currentLocationText}`
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#374151" />
                </Pressable>
                <Text style={styles.headerTitle}>장애물 제보</Text>
            </View>

            <View style={styles.formSection}>
                <ImageUploadBox imageUri={imageUri} onChangeImage={setImageUri} />

                <ObstacleTypeSelect
                    selectedType={selectedType}
                    onChangeType={setSelectedType}
                />

                <DescriptionInput
                    value={description}
                    onChangeText={setDescription}
                />

                <LocationPreview locationText={currentLocationText} />

                <SubmitButton onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 20,
        gap: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    backButton: {
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
    },
    formSection: {
        gap: 23,
    },
});