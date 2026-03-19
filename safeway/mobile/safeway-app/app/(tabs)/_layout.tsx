// 메인화면 맨 아래의 홈/교통약자 서비스/즐겨찾기/마이 4개 탭
import { Tabs } from "expo-router";
import { Home, Users, Heart, User } from "lucide-react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2563EB",
                tabBarInactiveTintColor: "#94A3B8",
                tabBarStyle: {
                    height: 84,
                    paddingTop: 10,
                    paddingBottom: 12,
                    borderTopWidth: 1,
                    borderTopColor: "#E2E8F0",
                    backgroundColor: "rgba(255,255,255,0.96)",
                    position: "absolute",
                    elevation: 0,
                    shadowColor: "#0F172A",
                    shadowOpacity: 0.06,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                    marginTop: 2,
                },
                tabBarIconStyle: {
                    marginTop: 2,
                },
                sceneStyle: {
                    backgroundColor: "#F8FAFC",
                },
            }}
        >
            <Tabs.Screen
                name="(map)"
                options={{
                    title: "홈",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Home color={color} size={focused ? 24 : 22} />
                    ),
                }}
            />

            <Tabs.Screen
                name="(services)"
                options={{
                    title: "교통약자 서비스",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Users color={color} size={focused ? 24 : 22} />
                    ),
                }}
            />

            <Tabs.Screen
                name="(favorites)"
                options={{
                    title: "즐겨찾기",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Heart color={color} size={focused ? 24 : 22} />
                    ),
                }}
            />

            <Tabs.Screen
                name="(my)"
                options={{
                    title: "마이",
                    tabBarIcon: ({ color, size, focused }) => (
                        <User color={color} size={focused ? 24 : 22} />
                    ),
                }}
            />
        </Tabs>
    );
}