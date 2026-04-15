// 이 코드는 즐겨찾기 페이지 전체 화면입니다.
// 교통약자 서비스 페이지와 같은 톤으로 구성하면서,
// 헤더 오른쪽에 추가 버튼을 같은 높이로 배치합니다.

import { YStack, XStack, Text, ScrollView } from 'tamagui'
import { Home, Building2, Hospital, Utensils, Plus } from 'lucide-react-native'

import FavoritesHeader from "@/src/features/favorites/components/FavoritesHeader"
import FavoriteCard from '@/src/features/favorites/components/FavoriteCard'
import FavoriteIconBox from '@/src/features/favorites/components/FavoriteIconBox'

const favoritePlaces = [
    {
        id: 1,
        title: '집',
        tag: '거주지',
        address: '서울시 마포구 상암동',
        bg: '#FEF3C7',
        icon: <Home size={20} color="#F97316" />,
    },
    {
        id: 2,
        title: '회사',
        tag: '직장',
        address: '경기도 오산시 양산동',
        bg: '#E0E7FF',
        icon: <Building2 size={20} color="#3B82F6" />,
    },
    {
        id: 3,
        title: '삼성서울병원',
        tag: '병원',
        address: '서울시 강남구 일원동',
        bg: '#F3E8FF',
        icon: <Hospital size={20} color="#A855F7" />,
    },
    {
        id: 4,
        title: '즐겨찾는 식당',
        tag: '맛집',
        address: '서울시 용산구 이태원동',
        bg: '#FEF3C7',
        icon: <Utensils size={20} color="#8B5CF6" />,
    },
]

export default function FavoritesScreen() {
    // 즐겨찾기 목록과 헤더 오른쪽 추가 버튼을 함께 렌더링하는 함수형 컴포넌트
    return (
        <ScrollView backgroundColor="#F3F4F6">
            <YStack padding={20} gap={16}>
                <XStack justifyContent="space-between" alignItems="flex-start">
                    <YStack gap={8} flex={1} paddingRight={12}>
                        <FavoritesHeader
                            title="즐겨찾기"
                            description="자주 가는 장소를 빠르게 검색하세요"
                            rightElement={
                                <XStack
                                    width={52}
                                    height={52}
                                    borderRadius={999}
                                    backgroundColor="#FACC15"
                                    alignItems="center"
                                    justifyContent="center"
                                    shadowColor="$shadowColor"
                                    shadowOpacity={0.12}
                                    shadowRadius={8}
                                    elevation={4}
                                    pressStyle={{ scale: 0.96 }}
                                >
                                    <Plus size={18} color="#111827" />
                                </XStack>
                            }
                        />
                    </YStack>
                </XStack>

                <YStack gap={12}>
                    {favoritePlaces.map((place) => (
                        <FavoriteCard
                            key={place.id}
                            title={place.title}
                            tag={place.tag}
                            address={place.address}
                            icon={
                                <FavoriteIconBox bg={place.bg}>
                                    {place.icon}
                                </FavoriteIconBox>
                            }
                        />
                    ))}
                </YStack>
            </YStack>
        </ScrollView>
    )
}