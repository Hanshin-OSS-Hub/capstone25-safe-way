// 홈 화면 하단의 빠른 액세스 카드 컴포넌트입니다. 집, 회사, 택시, 제보 등의 빠른 액세스 버튼을 제공합니다.
import React from "react";
import { XStack, YStack, Text } from "tamagui";
import { Home, Building2, Car, AlertCircle } from "lucide-react-native";
import { router } from "expo-router";

type QuickItemProps = {
    label: string;
    iconBg: string;
    iconColor: string;
    icon: React.ReactNode;
    onPress?: () => void;
};

function QuickItem({
                       label,
                       iconBg,
                       iconColor,
                       icon,
                       onPress,
                   }: QuickItemProps) {
    return (
        <YStack
            flex={1}
            aspectRatio={1}
            alignItems="center"
            justifyContent="center"
            gap="$2"
            py="$1"
            px="$2"
            borderRadius="$7"
            backgroundColor="#F8FAFC"
            borderWidth={1}
            borderColor="#E2E8F0"
            pressStyle={{
                scale: 0.97,
                backgroundColor: "#F1F5F9",
            }}
            onPress={onPress}
        >
            <YStack
                width={45}
                height={45}
                borderRadius={999}
                alignItems="center"
                justifyContent="center"
                backgroundColor={iconBg}
            >
                {icon}
            </YStack>

            <Text
                fontSize={13}
                fontWeight="600"
                color="#0F172A"
                textAlign="center"
            >
                {label}
            </Text>
        </YStack>
    );
}

export function HomeQuickCard() {
    return (
        <YStack
            backgroundColor="rgba(255,255,255,0.96)"
            borderRadius="$8"
            p="$3.5"
            borderWidth={1}
            borderColor="#E2E8F0"
            shadowColor="#0F172A"
            shadowOpacity={0.08}
            shadowRadius={16}
            elevation={5}
        >

            <XStack gap="$2">
                <QuickItem
                    label="집"
                    iconBg="#DBEAFE"
                    iconColor="#2563EB"
                    icon={<Home color="#2563EB" size={20} />}
                />
                <QuickItem
                    label="회사"
                    iconBg="#F3E8FF"
                    iconColor="#7C3AED"
                    icon={<Building2 color="#7C3AED" size={20} />}
                />
                <QuickItem
                    label="택시"
                    iconBg="#DCFCE7"
                    iconColor="#16A34A"
                    icon={<Car color="#16A34A" size={20} />}
                />
                <QuickItem
                    label="제보"
                    iconBg="#FCE7F3"
                    iconColor="#DB2777"
                    icon={<AlertCircle color="#DB2777" size={20} />}
                    onPress={() => router.push("/report")}
                />
            </XStack>
        </YStack>
    );
}