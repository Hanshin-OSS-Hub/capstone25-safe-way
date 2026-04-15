// 이 코드는 즐겨찾기 페이지에서 사용하는 헤더 컴포넌트입니다.
// 기존 PageHeader 구조를 유지하면서 오른쪽에 버튼(플로팅 + 버튼 등)을 추가할 수 있도록 확장했습니다.

import { XStack, YStack, Text } from "tamagui"

type Props = {
    title: string
    description?: string
    rightElement?: React.ReactNode
}

export default function FavoritesHeader({ title, description, rightElement }: Props) {
    // 제목/설명 + 오른쪽 액션 버튼을 함께 렌더링하는 헤더 컴포넌트
    return (
        <XStack justifyContent="space-between" alignItems="flex-start">

            {/* 왼쪽 (기존 PageHeader 구조 유지) */}
            <YStack gap={6} flex={1} paddingRight={12}>
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

            {/* 오른쪽 (버튼 등) */}
            {rightElement}
        </XStack>
    )
}