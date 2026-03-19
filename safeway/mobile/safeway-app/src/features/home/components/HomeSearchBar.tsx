// 메인화면의 출발지 목적지 검색 컴포넌트
import React from "react";
import { Pressable } from "react-native";
import { XStack, YStack, Text } from "tamagui";
import { Accessibility, User, Search } from "lucide-react-native";
import { useRouter } from "expo-router";

export function HomeSearchBar() {
    const router = useRouter();

    const handlePress = () => {
        router.push("/search");
    };

    return (
        <Pressable onPress={handlePress}>
            <XStack
                px="$3.5"
                py="$3"
                alignItems="center"
                gap="$3"
                backgroundColor="rgba(255,255,255,0.96)"
                borderRadius="$8"
                borderWidth={1}
                borderColor="#E2E8F0"
                shadowColor="#0F172A"
                shadowOpacity={0.08}
                shadowRadius={16}
                elevation={5}
            >
                <YStack
                    width={46}
                    height={46}
                    borderRadius={999}
                    backgroundColor="#2563EB"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Accessibility color="white" size={21} />
                </YStack>

                <YStack flex={1} gap={2}>
                    <Text
                        fontSize={15}
                        color="#94A3B8"
                        fontWeight="500"
                    >
                        출발지 또는 목적지를 입력해주세요
                    </Text>
                </YStack>

                <YStack
                    width={42}
                    height={42}
                    borderRadius={999}
                    backgroundColor="#F8FAFC"
                    borderWidth={1}
                    borderColor="#E2E8F0"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Search color="#2563EB" size={18} />
                </YStack>
            </XStack>
        </Pressable>
    );
}