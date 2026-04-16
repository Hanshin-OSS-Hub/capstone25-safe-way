// 이 코드는 교통약자 서비스 탭에서 이용 가능한 서비스 목록을 보여주는 화면 코드입니다.
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Bus, Car, Info, Phone, TrainFront } from "lucide-react-native"

import ServiceCard from "@/src/features/traffic_services/components/ServiceCard"
import IconBox from "@/src/features/traffic_services/components/ServiceIconBox"

// 교통약자 서비스 화면의 제목과 설명을 보여주는 함수입니다.
function ServicesHeader() {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>교통약자 서비스</Text>
            <Text style={styles.description}>이동을 위한 다양한 서비스를 이용하세요</Text>
        </View>
    )
}

// 교통약자 서비스 목록 화면을 렌더링하는 함수입니다.
export default function ServicesScreen() {
    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <ServicesHeader />

            <ServiceCard
                title="버스 정보"
                icon={
                    <IconBox bg="#DCFCE7">
                        <Bus size={20} color="#16A34A" />
                    </IconBox>
                }
            />

            <ServiceCard
                title="장애인 콜택시 예약"
                icon={
                    <IconBox bg="#DBEAFE">
                        <Car size={20} color="#2563EB" />
                    </IconBox>
                }
            />

            <ServiceCard
                title="장애인 복지콜 예약"
                icon={
                    <IconBox bg="#EDE9FE">
                        <Phone size={20} color="#7C3AED" />
                    </IconBox>
                }
            />

            <ServiceCard
                title="지하철 도우미"
                icon={
                    <IconBox bg="#FED7AA">
                        <TrainFront size={20} color="#EA580C" />
                    </IconBox>
                }
            />

            <ServiceCard
                title="이동약자 접근성 정보"
                icon={
                    <IconBox bg="#DBEAFE">
                        <Info size={20} color="#4F46E5" />
                    </IconBox>
                }
            />
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
    header: {
        gap: 6,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
    },
    description: {
        fontSize: 14,
        color: "#6B7280",
    },
})
