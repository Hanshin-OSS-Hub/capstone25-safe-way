// 이 코드는 즐겨찾기 탭에서 자주 가는 장소 목록과 추가 버튼을 보여주는 화면 코드입니다.
import { ScrollView, StyleSheet, View } from "react-native"
import { Building2, Home, Hospital, Plus, Utensils } from "lucide-react-native"

import FavoriteCard from "@/src/features/favorites/components/FavoriteCard"
import FavoriteIconBox from "@/src/features/favorites/components/FavoriteIconBox"
import FavoritesHeader from "@/src/features/favorites/components/FavoritesHeader"

const favoritePlaces = [
    {
        id: 1,
        title: "집",
        tag: "거주지",
        address: "서울시 마포구 상암동",
        bg: "#FEF3C7",
        icon: <Home size={20} color="#F97316" />,
    },
    {
        id: 2,
        title: "회사",
        tag: "직장",
        address: "경기도 성남시 분당구",
        bg: "#E0E7FF",
        icon: <Building2 size={20} color="#3B82F6" />,
    },
    {
        id: 3,
        title: "삼성서울병원",
        tag: "병원",
        address: "서울시 강남구 일원동",
        bg: "#F3E8FF",
        icon: <Hospital size={20} color="#A855F7" />,
    },
    {
        id: 4,
        title: "즐겨찾는 식당",
        tag: "맛집",
        address: "서울시 용산구 이태원동",
        bg: "#FEF3C7",
        icon: <Utensils size={20} color="#8B5CF6" />,
    },
]

// 장소 추가 버튼을 원형 아이콘 버튼으로 보여주는 함수입니다.
function AddPlaceButton() {
    return (
        <View style={styles.addButton}>
            <Plus size={18} color="#111827" />
        </View>
    )
}

// 즐겨찾기 장소 목록 화면을 렌더링하는 함수입니다.
export default function FavoritesScreen() {
    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <FavoritesHeader
                title="즐겨찾기"
                description="자주 가는 장소를 빠르게 검색하세요"
                rightElement={<AddPlaceButton />}
            />

            <View style={styles.list}>
                {favoritePlaces.map((place) => (
                    <FavoriteCard
                        key={place.id}
                        title={place.title}
                        tag={place.tag}
                        address={place.address}
                        icon={<FavoriteIconBox bg={place.bg}>{place.icon}</FavoriteIconBox>}
                    />
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    content: {
        padding: 20,
        gap: 16,
    },
    addButton: {
        width: 52,
        height: 52,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FACC15",
        shadowColor: "#0F172A",
        shadowOpacity: 0.12,
        shadowRadius: 8,
    },
    list: {
        gap: 12,
    },
})
