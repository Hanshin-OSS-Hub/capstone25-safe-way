// 이 코드는 메인 화면 하단의 집, 회사, 택시, 제보 빠른 접근 카드 컴포넌트 코드입니다.
import type { ReactNode } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { AlertCircle, Building2, Car, Home } from "lucide-react-native"
import { router } from "expo-router"

type QuickItemProps = {
    label: string
    iconBg: string
    icon: ReactNode
    onPress?: () => void
}

// 빠른 접근 항목 하나를 아이콘과 라벨로 렌더링하는 함수입니다.
function QuickItem({ label, iconBg, icon, onPress }: QuickItemProps) {
    return (
        <Pressable style={styles.quickItem} onPress={onPress}>
            <View style={[styles.quickIconBox, { backgroundColor: iconBg }]}>{icon}</View>
            <Text style={styles.quickLabel}>{label}</Text>
        </Pressable>
    )
}

// 장애물 제보 화면으로 이동하는 함수입니다.
function handlePressReport() {
    router.push("/report")
}

// 메인 화면 하단 빠른 접근 카드 전체를 렌더링하는 함수입니다.
export function HomeQuickCard() {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <QuickItem label="집" iconBg="#DBEAFE" icon={<Home color="#2563EB" size={20} />} />
                <QuickItem label="회사" iconBg="#F3E8FF" icon={<Building2 color="#7C3AED" size={20} />} />
                <QuickItem label="택시" iconBg="#DCFCE7" icon={<Car color="#16A34A" size={20} />} />
                <QuickItem
                    label="제보"
                    iconBg="#FCE7F3"
                    icon={<AlertCircle color="#DB2777" size={20} />}
                    onPress={handlePressReport}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 14,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "rgba(255,255,255,0.96)",
        shadowColor: "#0F172A",
        shadowOpacity: 0.08,
        shadowRadius: 16,
    },
    row: {
        flexDirection: "row",
        gap: 8,
    },
    quickItem: {
        flex: 1,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#F8FAFC",
    },
    quickIconBox: {
        width: 45,
        height: 45,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    quickLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#0F172A",
        textAlign: "center",
    },
})
