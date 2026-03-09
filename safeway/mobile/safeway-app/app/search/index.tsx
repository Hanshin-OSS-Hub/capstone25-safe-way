import { useEffect, useMemo, useState } from 'react'
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import {
    ArrowLeft,
    ArrowRight,
    Clock3,
    House,
    MapPinned,
    Navigation,
    Building2,
    Hospital,
} from 'lucide-react-native'

import type { FavoritePlace, RecentRoute } from '@/src/features/route/types'

const COLORS = {
    bg: '#F5F6F8',
    text: '#1F2937',
    subText: '#6B7280',
    white: '#FFFFFF',
    lineBlue: '#9FC5FF',
    lineYellow: '#F2C94C',
    primaryBlue: '#3B82F6',
    primaryYellow: '#F7C600',
    card: '#EEF4FF',
    iconGray: '#6B7280',
    inputPlaceholder: '#9CA3AF',
    recentCard: '#F8FAFC',
}

const recentRoutes: RecentRoute[] = [
    { id: '1', start: '병점역', end: '한신대' },
    { id: '2', start: '서울역', end: '이태원역' },
    { id: '3', start: '혜화역', end: '홍대입구역' },
]

const favoritePlaces: FavoritePlace[] = [
    {
        id: 'home',
        label: '집',
        name: '집',
        address: '서울시 마포구',
    },
    {
        id: 'office',
        label: '회사',
        name: '회사',
        address: '경기도 오산시',
    },
    {
        id: 'hospital',
        label: '병원',
        name: '병원',
        address: '서울시 서대문구',
    },
]

export default function RouteSearchScreen() {
    const params = useLocalSearchParams<{
        startName?: string
        startAddress?: string
        endName?: string
        endAddress?: string
        autoSearch?: string
    }>()

    const [start, setStart] = useState(params.startName ?? '')
    const [end, setEnd] = useState(params.endName ?? '')

    useEffect(() => {
        if (params.startName) setStart(params.startName)
        if (params.endName) setEnd(params.endName)
    }, [params.startName, params.endName])

    useEffect(() => {
        const shouldAutoSearch =
            params.autoSearch === 'true' && params.startName && params.endName

        if (shouldAutoSearch) {
            handleSearch(params.startName!, params.endName!)
        }
    }, [params.autoSearch, params.startName, params.endName])

    const canSearch = useMemo(() => {
        return start.trim().length > 0 && end.trim().length > 0
    }, [start, end])

    const handleSearch = (startValue?: string, endValue?: string) => {
        const finalStart = (startValue ?? start).trim()
        const finalEnd = (endValue ?? end).trim()

        if (!finalStart || !finalEnd) return

        router.push({
            pathname: '/route',
            params: {
                startName: finalStart,
                endName: finalEnd,
            },
        })
    }

    const handleUseCurrentLocation = () => {
        setStart('현재 위치')
    }

    const handleRecentPress = (routeItem: RecentRoute) => {
        setStart(routeItem.start)
        setEnd(routeItem.end)
    }

    const handleFavoritePress = (place: FavoritePlace) => {
        setEnd(place.name)
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.root}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color={COLORS.text} />
                    </Pressable>
                    <Text style={styles.headerTitle}>경로 검색</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.inputSection}>
                        <View style={[styles.inputCard, styles.startCard]}>
                            <View style={styles.inputLeft}>
                                <View style={[styles.iconCircle, { backgroundColor: COLORS.primaryBlue }]}>
                                    <MapPinned size={18} color={COLORS.white} />
                                </View>

                                <TextInput
                                    value={start}
                                    onChangeText={setStart}
                                    placeholder="출발지 입력"
                                    placeholderTextColor={COLORS.inputPlaceholder}
                                    style={styles.input}
                                />
                            </View>

                            <Pressable
                                onPress={handleUseCurrentLocation}
                                style={styles.currentLocationButton}
                            >
                                <Text style={styles.currentLocationText}>현재 위치</Text>
                            </Pressable>
                        </View>

                        <View style={[styles.inputCard, styles.endCard]}>
                            <View style={styles.inputLeft}>
                                <View style={[styles.iconCircle, { backgroundColor: '#F4B400' }]}>
                                    <Navigation size={18} color={COLORS.white} />
                                </View>

                                <TextInput
                                    value={end}
                                    onChangeText={setEnd}
                                    placeholder="도착지 입력"
                                    placeholderTextColor={COLORS.inputPlaceholder}
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        <Pressable
                            onPress={() => handleSearch()}
                            style={[
                                styles.searchButton,
                                !canSearch && { opacity: 0.5 },
                            ]}
                            disabled={!canSearch}
                        >
                            <Text style={styles.searchButtonText}>경로 찾기</Text>
                        </Pressable>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionTitleRow}>
                            <Clock3 size={22} color={COLORS.iconGray} />
                            <Text style={styles.sectionTitle}>최근 검색</Text>
                        </View>

                        <View style={styles.listGap}>
                            {recentRoutes.map((item) => (
                                <Pressable
                                    key={item.id}
                                    style={styles.recentItem}
                                    onPress={() => handleRecentPress(item)}
                                >
                                    <Text style={styles.recentText}>
                                        {item.start} → {item.end}
                                    </Text>
                                    <ArrowRight size={18} color={COLORS.inputPlaceholder} />
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionTitleRow}>
                            <House size={22} color={COLORS.iconGray} />
                            <Text style={styles.sectionTitle}>즐겨찾기</Text>
                        </View>

                        <View style={styles.listGap}>
                            {favoritePlaces.map((item) => (
                                <Pressable
                                    key={item.id}
                                    style={styles.favoriteItem}
                                    onPress={() => handleFavoritePress(item)}
                                >
                                    <View style={styles.favoriteLeft}>
                                        <View style={styles.favoriteEmojiWrap}>
                                            {item.id === 'home' && <House size={22} color={COLORS.iconGray} />}
                                            {item.id === 'office' && <Building2 size={22} color={COLORS.iconGray} />}
                                            {item.id === 'hospital' && <Hospital size={22} color={COLORS.iconGray} />}
                                        </View>

                                        <View>
                                            <Text style={styles.favoriteTitle}>{item.label}</Text>
                                            <Text style={styles.favoriteAddress}>{item.address}</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    root: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingTop: 6,
        paddingBottom: 16,
        gap: 10,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    inputSection: {
        gap: 14,
    },
    inputCard: {
        height: 68,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    startCard: {
        borderWidth: 2,
        borderColor: COLORS.lineBlue,
    },
    endCard: {
        borderWidth: 2,
        borderColor: COLORS.lineYellow,
    },
    inputLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: COLORS.text,
    },
    currentLocationButton: {
        backgroundColor: '#EEF4FF',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginLeft: 12,
    },
    currentLocationText: {
        color: COLORS.primaryBlue,
        fontSize: 14,
        fontWeight: '600',
    },
    searchButton: {
        height: 70,
        borderRadius: 20,
        backgroundColor: COLORS.primaryYellow,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    searchButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    section: {
        marginTop: 36,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    listGap: {
        gap: 10,
    },
    recentItem: {
        height: 54,
        borderRadius: 16,
        backgroundColor: COLORS.recentCard,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    recentText: {
        fontSize: 16,
        color: COLORS.text,
    },
    favoriteItem: {
        minHeight: 94,
        borderRadius: 18,
        backgroundColor: '#EEF4FF',
        paddingHorizontal: 18,
        paddingVertical: 18,
        justifyContent: 'center',
    },
    favoriteLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    favoriteEmojiWrap: {
        width: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    favoriteAddress: {
        fontSize: 15,
        color: COLORS.subText,
    },
})