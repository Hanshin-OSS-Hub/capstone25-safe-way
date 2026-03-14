import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { Stack } from "expo-router"
import { useColorScheme } from "react-native"
import { TamaguiProvider } from "tamagui"
import { useFonts } from "expo-font"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

import { tamaguiConfig } from "../tamagui.config"

export default function RootLayout() {
    const colorScheme = useColorScheme()

    const [loaded] = useFonts({
        PretendardThin: require("../src/assets/fonts/Pretendard-Thin.otf"),
        PretendardExtraLight: require("../src/assets/fonts/Pretendard-ExtraLight.otf"),
        PretendardLight: require("../src/assets/fonts/Pretendard-Light.otf"),
        PretendardRegular: require("../src/assets/fonts/Pretendard-Regular.otf"),
        PretendardMedium: require("../src/assets/fonts/Pretendard-Medium.otf"),
        PretendardSemiBold: require("../src/assets/fonts/Pretendard-SemiBold.otf"),
        PretendardBold: require("../src/assets/fonts/Pretendard-Bold.otf"),
        PretendardExtraBold: require("../src/assets/fonts/Pretendard-ExtraBold.otf"),
        PretendardBlack: require("../src/assets/fonts/Pretendard-Black.otf"),
    })

    if (!loaded) return null

    return (
                <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? "light"}>
                    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" />
                        </Stack>
                    </ThemeProvider>
                </TamaguiProvider>
    )
}