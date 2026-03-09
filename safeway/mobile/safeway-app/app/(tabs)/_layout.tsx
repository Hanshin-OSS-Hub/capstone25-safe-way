// 메인화면 맨 아래의 홈/교통약자 서비스/즐겨찾기/마이 4개 탭
import { Tabs } from "expo-router";
import { Home, Users, Heart, User } from "lucide-react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2563EB",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: {
                    height: 80,
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#E5E7EB",
                    backgroundColor: "transparent",
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="(map)"
                options={{
                    title: "홈",
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name="(services)"
                options={{
                    title: "교통약자 서비스",
                    tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name="(favorites)"
                options={{
                    title: "즐겨찾기",
                    tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name="(my)"
                options={{
                    title: "마이",
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}