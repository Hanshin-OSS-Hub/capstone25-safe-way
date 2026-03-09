// 홈 화면 하단의 빠른 액세스 카드 컴포넌트입니다. 집, 회사, 택시, 제보 등의 빠른 액세스 버튼을 제공합니다.
import React from "react";
import { XStack, YStack, Text } from "tamagui";
import { Home, Building2, Car, AlertCircle } from "lucide-react-native";

function QuickItem({
                       label,
                       bg,
                       icon,
                   }: {
    label: string;
    bg: string;
    icon: React.ReactNode;
}) {
    return (
        <YStack
            flex={1}
            backgroundColor={bg}
            borderRadius="$8"
            py="$3"
            alignItems="center"
            justifyContent="center"
            gap="$2"
        >
            {icon}
            <Text fontSize={14} color="#111827">
                {label}
            </Text>
        </YStack>
    );
}

export function HomeQuickCard() {
    return (
        <YStack
            position="absolute"
            left={0}
            right={0}
            bottom={10} // 탭바 위로 띄우기
            px="$3"
        >
            <YStack
                backgroundColor="white"
                borderRadius="$9"
                p="$3"
                shadowColor="#000"
                shadowOpacity={0.08}
                shadowRadius={14}
                elevation={6}
            >
                <XStack gap="$3">
                    <QuickItem
                        label="집"
                        bg="#DBEAFE"
                        icon={<Home color="#2563EB" size={26} />}
                    />
                    <QuickItem
                        label="회사"
                        bg="#F3E8FF"
                        icon={<Building2 color="#7C3AED" size={26} />}
                    />
                    <QuickItem
                        label="택시"
                        bg="#DCFCE7"
                        icon={<Car color="#16A34A" size={26} />}
                    />
                    <QuickItem
                        label="제보"
                        bg="#FCE7F3"
                        icon={<AlertCircle color="#DB2777" size={26} />}
                    />
                </XStack>
            </YStack>
        </YStack>
    );
}