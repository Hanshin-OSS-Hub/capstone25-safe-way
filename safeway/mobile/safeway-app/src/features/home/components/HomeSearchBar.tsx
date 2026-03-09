import React from "react";
import { Pressable } from "react-native";
import { XStack, YStack, Text } from "tamagui";
import { Accessibility, User } from "lucide-react-native";
import { useRouter } from "expo-router";

export function HomeSearchBar() {
    const router = useRouter();

    const handlePress = () => {
        console.log("검색바 클릭됨");
        router.push("/search");
    };

    return (
        <Pressable onPress={handlePress}>
            <XStack
                mx="$4"
                mt="$10"
                px="$4"
                py="$3"
                alignItems="center"
                backgroundColor="white"
                borderRadius="$10"
                shadowColor="#000"
                shadowOpacity={0.08}
                shadowRadius={12}
                elevation={4}
            >
                <YStack
                    width={44}
                    height={44}
                    borderRadius={999}
                    backgroundColor="#2563EB"
                    alignItems="center"
                    justifyContent="center"
                    mr="$3"
                >
                    <Accessibility color="white" size={22} />
                </YStack>

                <YStack flex={1}>
                    <Text color="#9CA3AF" fontSize={16}>
                        출발지 또는 목적지 입력
                    </Text>
                </YStack>

                <YStack
                    width={44}
                    height={44}
                    borderRadius={999}
                    backgroundColor="#F1F5F9"
                    alignItems="center"
                    justifyContent="center"
                >
                    <User color="#2563EB" size={20} />
                </YStack>
            </XStack>
        </Pressable>
    );
}