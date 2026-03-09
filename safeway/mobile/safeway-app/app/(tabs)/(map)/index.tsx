// 홈 화면
import React from "react";
import { YStack } from "tamagui";
import { MapPatternBackground } from "@/src/features/home/components/MapPatternBackground";
import { HomeSearchBar } from "@/src/features/home/components/HomeSearchBar";
import { HomeQuickCard } from "@/src/features/home/components/HomeQuickCard";

export default function HomeScreen() {
    return (
        <YStack flex={1} backgroundColor="#F8FAFC">
            <MapPatternBackground />
            <HomeSearchBar />
            <HomeQuickCard />
        </YStack>
    );
}