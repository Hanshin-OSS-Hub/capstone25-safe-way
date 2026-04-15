// 이 코드는 즐겨찾기 카드 컴포넌트입니다.
// 제목 + 태그 + 주소 정보를 함께 표시합니다.

import { XStack, YStack, Text } from 'tamagui'
import { ChevronRight, MapPin } from 'lucide-react-native'

type Props = {
    icon: React.ReactNode
    title: string
    tag: string
    address: string
}

export default function FavoriteCard({ icon, title, tag, address }: Props) {
    // 즐겨찾기 카드 하나를 렌더링하는 함수형 컴포넌트
    return (
        <XStack
            alignItems="center"
            justifyContent="space-between"
            padding={16}
            marginBottom={1}
            backgroundColor="white"
            borderRadius={16}
            shadowColor="$shadowColor"
            shadowOpacity={0.1}
            shadowRadius={8}
        >
            {/* 왼쪽 영역 */}
            <XStack alignItems="center" gap={12} flex={1}>
                {icon}

                <YStack flex={1} gap={6}>
                    {/* 제목 + 태그 */}
                    <XStack alignItems="center" gap={8} flexWrap="wrap">
                        <Text fontSize={16} fontWeight="500">
                            {title}
                        </Text>

                        <XStack
                            backgroundColor="#EFF6FF"
                            paddingHorizontal={8}
                            paddingVertical={2}
                            borderRadius={999}
                        >
                            <Text fontSize={12} color="#2563EB" fontWeight="500">
                                {tag}
                            </Text>
                        </XStack>
                    </XStack>

                    {/* 주소 */}
                    <XStack alignItems="center" gap={6}>
                        <MapPin size={14} color="#9CA3AF" />
                        <Text
                            fontSize={14}
                            color="#6B7280"
                            numberOfLines={1}
                        >
                            {address}
                        </Text>
                    </XStack>
                </YStack>
            </XStack>

            {/* 오른쪽 화살표 */}
            <ChevronRight size={20} color="#9CA3AF" />
        </XStack>
    )
}