// 서비스페이지 카드 속 왼쪽 아아콘박스 컴포넌트
import {YStack } from 'tamagui'

type Props = {
    bg: string
    children: React.ReactNode
}

export default function IconBox({ bg, children }: Props) {
    return (
        <YStack
            width={40}
            height={40}
            borderRadius={10}
            alignItems="center"
            justifyContent="center"
            backgroundColor={bg}
        >
            {children}
        </YStack>
    )
}