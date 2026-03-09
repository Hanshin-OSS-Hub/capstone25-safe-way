import { Pressable, Image } from "react-native"

type Props = {
    onPress: () => void
}

export default function KakaoLoginButton({ onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                width: "100%",
                alignItems: "center",
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.9 : 1,
            })}
        >
            <Image
                source={require("@/src/assets/kakao/kakao_login_large_wide.png")}
                style={{
                    width: "100%",
                    maxWidth: 360,
                    height: 52,
                }}
                resizeMode="contain"
            />
        </Pressable>
    )
}