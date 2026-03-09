import { useRouter } from "expo-router"
import { Card, Separator, Text, XStack, YStack } from "tamagui"
import { Accessibility } from "@tamagui/lucide-icons"
import { LinearGradient } from "expo-linear-gradient"
import KakaoLoginButton from "@/src/features/mypage/components/KakaoLoginButton"

export default function LoginScreen() {
    const router = useRouter()

    const onKakaoLogin = async () => {
        router.replace("/(tabs)")
    }

    return (
        <YStack flex={1} paddingHorizontal={24}>

            {/* 상단 로고 영역 */}
            <YStack alignItems="center" paddingTop={130} gap={10}>
                {/* 1) 로고 그라데이션 + 2) 자연스러운 그림자 */}
                <YStack
                    width={88}
                    height={88}
                    borderRadius={24}
                    overflow="hidden"
                    shadowColor="#000"
                    shadowOpacity={0.16}
                    shadowRadius={22}
                    shadowOffset={{ width: 0, height: 12 }}
                >
                    <LinearGradient
                        colors={["#3B82F6", "#2563EB"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Accessibility size={44} color="white" />
                    </LinearGradient>
                </YStack>

                {/* 5) 앱 이름 자간 */}
                <Text fontSize={30} fontWeight="900" color="#111827" letterSpacing={0.4}>
                    SafeWay
                </Text>

                <Text fontSize={14} color="#6B7280">
                    안전한 이동을 위한 동행
                </Text>
            </YStack>

            {/* 중앙 로그인 영역 */}
            <YStack flex={1} justifyContent="center">
                <Card
                    padding={22}
                    borderRadius={24}
                    backgroundColor="white"
                    borderWidth={1}
                    borderColor="#E8ECF3"
                    shadowColor="#000"
                    shadowOpacity={0.08}
                    shadowRadius={22}
                    shadowOffset={{ width: 0, height: 12 }}
                >
                    {/* 3) 카드 상단 하이라이트 */}
                    <YStack
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        height={2}
                        borderTopLeftRadius={24}
                        borderTopRightRadius={24}
                        backgroundColor="#EEF2FF"
                    />

                    <YStack gap={14}>
                        <YStack gap={6}>
                            <Text fontSize={18} fontWeight="900" color="#111827">
                                계정으로 로그인
                            </Text>
                            <Text fontSize={13} color="#6B7280">
                                카카오 로그인만 지원해요
                            </Text>
                        </YStack>

                        <Separator />

                        {/* 4) 버튼 눌림 애니메이션은 KakaoLoginButton에서 처리(아래 참고) */}
                        <KakaoLoginButton onPress={onKakaoLogin} />

                        <Text fontSize={12} color="#9CA3AF" lineHeight={18}>
                            로그인 시 서비스 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.
                        </Text>
                    </YStack>
                </Card>
            </YStack>

            {/* 하단 문구 */}
            <XStack justifyContent="center" paddingBottom={18}>
                <Text fontSize={12} color="#B0B7C3">
                    © SafeWay
                </Text>
            </XStack>
        </YStack>
    )
}