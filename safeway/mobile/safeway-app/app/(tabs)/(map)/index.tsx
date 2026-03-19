import React from "react";
import { SafeAreaView } from "react-native";
import { YStack } from "tamagui";
import CurrentLocationMapScreen from "@/src/features/map/screens/CurrentLocationMapScreen";
import { HomeSearchBar } from "@/src/features/home/components/HomeSearchBar";
import { HomeQuickCard } from "@/src/features/home/components/HomeQuickCard";

export default function HomeScreen() {
    return (
        <YStack flex={1} position="relative" backgroundColor="#F8FAFC">
            <YStack flex={1}>
                <CurrentLocationMapScreen />
            </YStack>

            <SafeAreaView
                pointerEvents="box-none"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 20,
                }}
            >
                <YStack flex={1} pointerEvents="box-none">
                    {/* 상단 검색바 */}
                    <YStack
                        px="$4"
                        pt="$2"
                        pointerEvents="box-none"
                    >
                        <HomeSearchBar />
                    </YStack>

                    {/* 남는 공간 */}
                    <YStack flex={1} pointerEvents="box-none" />

                    {/* 하단 퀵카드 */}
                    <YStack
                        px="$4"
                        pb={60}
                        pointerEvents="box-none"
                    >
                        <HomeQuickCard />
                    </YStack>
                </YStack>
            </SafeAreaView>
        </YStack>
    );
}