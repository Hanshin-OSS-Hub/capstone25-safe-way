import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";
import { APP_BG } from "@/src/shared/constants/backgroundColor";

export default function AppStackLayout() {
    return (
        // ✅ 배경은 바깥(전체 화면)에 깔기
        <YStack flex={1} backgroundColor={APP_BG}>
            {/* ✅ SafeArea는 "내용"만 top 적용 */}
            <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                {/* Stack 화면은 배경 투명하게 */}
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "transparent" },
                    }}
                />
            </SafeAreaView>
        </YStack>
    );
}