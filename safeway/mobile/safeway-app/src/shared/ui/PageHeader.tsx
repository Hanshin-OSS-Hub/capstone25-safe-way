// 각 페이지의 헤더 컴포넌트
import { YStack, Text } from "tamagui"

type Props = {
    title: string
    description?: string
}

export default function PageHeader({ title, description }: Props) {
    return (
        <YStack gap={6}>
            <Text
                mt="$1"
                fontSize={22}
                fontWeight="700"
                color="#111827"
            >
                {title}
            </Text>

            {description && (
                <Text
                    mb="$2"
                    fontSize={14}
                    color="#6B7280"
                >
                    {description}
                </Text>
            )}
        </YStack>
    )
}