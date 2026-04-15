// 이 코드는 즐겨찾기 카드 왼쪽에 들어가는 아이콘 박스 컴포넌트입니다.

import { YStack } from 'tamagui'

type Props = {
    bg: string
    children: React.ReactNode
}

export default function FavoriteIconBox({ bg, children }: Props) {
    // 서비스 탭과 동일한 크기의 아이콘 박스를 렌더링하는 함수형 컴포넌트
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