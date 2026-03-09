// 교통약자 서비스 페이지
import { ScrollView, YStack, Text } from 'tamagui'
import ServiceCard from '@/src/features/traffic_services/components/ServiceCard'
import IconBox from '@/src/features/traffic_services/components/ServiceIconBox'
import PageHeader from "@/src/shared/ui/PageHeader"

import {
    Bus,
    Car,
    Phone,
    TrainFront,
    Info
} from 'lucide-react-native'

export default function ServicesScreen() {
    return (
        <ScrollView backgroundColor="#F3F4F6">
            <YStack padding={20} gap={16}>

                {/* header */}
                <PageHeader
                    title="교통약자 서비스"
                    description="편리한 이동을 위한 다양한 서비스를 이용하세요"
                />

                {/* services */}
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

            </YStack>
        </ScrollView>
    )
}