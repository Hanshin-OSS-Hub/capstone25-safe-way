// 교통약자 서비스 페이지의 카드 컴포넌트
import { XStack, YStack, Text } from 'tamagui'
import { ChevronRight } from 'lucide-react-native'

type Props = {
    icon: React.ReactNode
    title: string
}

export default function ServiceCard({ icon, title }: Props) {
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
            <XStack alignItems="center" gap={12}>
                {icon}

                <Text fontSize={16} fontWeight="500">
                    {title}
                </Text>
            </XStack>

            <ChevronRight size={20} color="#9CA3AF" />
        </XStack>
    )
}