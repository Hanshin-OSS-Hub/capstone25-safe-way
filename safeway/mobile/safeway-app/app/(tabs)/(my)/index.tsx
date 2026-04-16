// 이 코드는 마이 탭에서 임시 로그인, 회원정보 입력, 회원정보 요약 화면을 전환하는 프론트 코드입니다.
import { useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Accessibility, BadgeCheck, UserRound } from "@tamagui/lucide-icons"
import { LinearGradient } from "expo-linear-gradient"
import KakaoLoginButton from "@/src/features/mypage/components/KakaoLoginButton"

// 회원정보 입력값을 저장하는 타입입니다.
type ProfileInfo = {
    name: string
    nickname: string
    gender: string
    age: string
    wheelchairType: string
}

// 마이 탭에서 현재 보여줄 화면 단계를 나타내는 타입입니다.
type MyPageStep = "login" | "profileForm" | "profileSummary"

// 선택 버튼에서 사용할 속성을 나타내는 타입입니다.
type OptionButtonProps = {
    label: string
    selected: boolean
    onPress: () => void
}

// 입력 필드에서 사용할 속성을 나타내는 타입입니다.
type FieldInputProps = {
    label: string
    value: string
    placeholder: string
    keyboardType?: "default" | "number-pad"
    onChangeText: (value: string) => void
}

// 회원정보 요약 행에서 사용할 속성을 나타내는 타입입니다.
type InfoRowProps = {
    label: string
    value: string
    isLast?: boolean
}

// 마이 탭의 로그인, 회원정보 입력, 회원정보 요약 상태를 관리하는 화면 컴포넌트입니다.
export default function MyPageScreen() {
    const [step, setStep] = useState<MyPageStep>("login")
    const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
        name: "",
        nickname: "",
        gender: "",
        age: "",
        wheelchairType: "",
    })
    const [errorMessage, setErrorMessage] = useState("")

    // 임시 로그인 또는 카카오 로그인이 성공했을 때 회원정보 입력 화면으로 이동하는 함수입니다.
    const handleLoginSuccess = () => {
        setErrorMessage("")
        setStep("profileForm")
    }

    // 이름 입력값을 회원정보 상태에 반영하는 함수입니다.
    const handleChangeName = (name: string) => {
        setProfileInfo((currentInfo) => ({ ...currentInfo, name }))
    }

    // 닉네임 입력값을 회원정보 상태에 반영하는 함수입니다.
    const handleChangeNickname = (nickname: string) => {
        setProfileInfo((currentInfo) => ({ ...currentInfo, nickname }))
    }

    // 나이 입력값을 숫자만 남겨 회원정보 상태에 반영하는 함수입니다.
    const handleChangeAge = (age: string) => {
        setProfileInfo((currentInfo) => ({ ...currentInfo, age: age.replace(/[^0-9]/g, "") }))
    }

    // 성별 선택값을 회원정보 상태에 반영하는 함수입니다.
    const handleSelectGender = (gender: string) => {
        setProfileInfo((currentInfo) => ({ ...currentInfo, gender }))
    }

    // 휠체어 종류 선택값을 회원정보 상태에 반영하는 함수입니다.
    const handleSelectWheelchairType = (wheelchairType: string) => {
        setProfileInfo((currentInfo) => ({ ...currentInfo, wheelchairType }))
    }

    // 회원정보 입력값을 검증하고 요약 화면으로 이동하는 함수입니다.
    const handleSubmitProfile = () => {
        const hasEmptyField = Object.values(profileInfo).some((value) => value.trim().length === 0)

        if (hasEmptyField) {
            setErrorMessage("모든 회원정보를 입력해 주세요.")
            return
        }

        setErrorMessage("")
        setStep("profileSummary")
    }

    // 회원정보를 다시 입력할 수 있도록 입력 화면으로 이동하는 함수입니다.
    const handleEditProfile = () => {
        setErrorMessage("")
        setStep("profileForm")
    }

    if (step === "profileForm") {
        return (
            <ProfileFormSection
                profileInfo={profileInfo}
                errorMessage={errorMessage}
                onChangeName={handleChangeName}
                onChangeNickname={handleChangeNickname}
                onChangeAge={handleChangeAge}
                onSelectGender={handleSelectGender}
                onSelectWheelchairType={handleSelectWheelchairType}
                onSubmitProfile={handleSubmitProfile}
            />
        )
    }

    if (step === "profileSummary") {
        return <ProfileSummarySection profileInfo={profileInfo} onEditProfile={handleEditProfile} />
    }

    return <LoginSection onLoginSuccess={handleLoginSuccess} />
}

// 로그인 전 SafeWay 소개와 임시 로그인 버튼을 보여주는 컴포넌트입니다.
function LoginSection({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    return (
        <View style={styles.loginContainer}>
            <View style={styles.logoSection}>
                <View style={styles.logoBox}>
                    <LinearGradient
                        colors={["#3B82F6", "#2563EB"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.logoGradient}
                    >
                        <Accessibility size={44} color="white" />
                    </LinearGradient>
                </View>

                <Text style={styles.logoTitle}>SafeWay</Text>
                <Text style={styles.logoDescription}>안전한 이동을 위한 동행</Text>
            </View>

            <View style={styles.loginCardWrapper}>
                <View style={styles.card}>
                    <View style={styles.cardHighlight} />

                    <View style={styles.loginTextGroup}>
                        <Text style={styles.cardTitle}>계정으로 로그인</Text>
                        <Text style={styles.cardDescription}>
                            지금은 임시 로그인으로 회원정보 입력 화면을 확인할 수 있어요.
                        </Text>
                    </View>

                    <View style={styles.separator} />

                    <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onLoginSuccess}>
                        <Text style={styles.primaryButtonText}>임시 로그인</Text>
                    </TouchableOpacity>

                    <KakaoLoginButton onPress={onLoginSuccess} />

                    <Text style={styles.termsText}>
                        로그인하면 서비스 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>© SafeWay</Text>
            </View>
        </View>
    )
}

// 로그인 성공 후 회원정보를 입력받는 컴포넌트입니다.
function ProfileFormSection({
    profileInfo,
    errorMessage,
    onChangeName,
    onChangeNickname,
    onChangeAge,
    onSelectGender,
    onSelectWheelchairType,
    onSubmitProfile,
}: {
    profileInfo: ProfileInfo
    errorMessage: string
    onChangeName: (value: string) => void
    onChangeNickname: (value: string) => void
    onChangeAge: (value: string) => void
    onSelectGender: (value: string) => void
    onSelectWheelchairType: (value: string) => void
    onSubmitProfile: () => void
}) {
    // 성별을 남성으로 선택하는 함수입니다.
    const handleSelectMale = () => {
        onSelectGender("남성")
    }

    // 성별을 여성으로 선택하는 함수입니다.
    const handleSelectFemale = () => {
        onSelectGender("여성")
    }

    // 성별을 기타로 선택하는 함수입니다.
    const handleSelectOtherGender = () => {
        onSelectGender("기타")
    }

    // 휠체어 종류를 전기휠체어로 선택하는 함수입니다.
    const handleSelectElectricWheelchair = () => {
        onSelectWheelchairType("전기휠체어")
    }

    // 휠체어 종류를 수동휠체어로 선택하는 함수입니다.
    const handleSelectManualWheelchair = () => {
        onSelectWheelchairType("수동휠체어")
    }

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>회원정보 입력</Text>
                <Text style={styles.pageDescription}>
                    SafeWay에서 맞춤 이동 정보를 보여드릴 수 있도록 기본 정보를 입력해 주세요.
                </Text>
            </View>

            <View style={styles.formCard}>
                <FieldInput
                    label="이름"
                    value={profileInfo.name}
                    placeholder="이름을 입력해 주세요"
                    onChangeText={onChangeName}
                />

                <FieldInput
                    label="닉네임"
                    value={profileInfo.nickname}
                    placeholder="닉네임을 입력해 주세요"
                    onChangeText={onChangeNickname}
                />

                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>성별</Text>
                    <View style={styles.optionRow}>
                        <OptionButton label="남성" selected={profileInfo.gender === "남성"} onPress={handleSelectMale} />
                        <OptionButton label="여성" selected={profileInfo.gender === "여성"} onPress={handleSelectFemale} />
                        <OptionButton
                            label="기타"
                            selected={profileInfo.gender === "기타"}
                            onPress={handleSelectOtherGender}
                        />
                    </View>
                </View>

                <FieldInput
                    label="나이"
                    value={profileInfo.age}
                    placeholder="나이를 입력해 주세요"
                    keyboardType="number-pad"
                    onChangeText={onChangeAge}
                />

                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>휠체어 종류</Text>
                    <View style={styles.optionRow}>
                        <OptionButton
                            label="전기휠체어"
                            selected={profileInfo.wheelchairType === "전기휠체어"}
                            onPress={handleSelectElectricWheelchair}
                        />
                        <OptionButton
                            label="수동휠체어"
                            selected={profileInfo.wheelchairType === "수동휠체어"}
                            onPress={handleSelectManualWheelchair}
                        />
                    </View>
                </View>

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onSubmitProfile}>
                    <Text style={styles.primaryButtonText}>회원정보 저장</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

// 텍스트 회원정보 입력 필드를 보여주는 컴포넌트입니다.
function FieldInput({ label, value, placeholder, keyboardType = "default", onChangeText }: FieldInputProps) {
    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                keyboardType={keyboardType}
                onChangeText={onChangeText}
                style={styles.textInput}
            />
        </View>
    )
}

// 성별과 휠체어 종류를 선택할 때 사용하는 버튼 컴포넌트입니다.
function OptionButton({ label, selected, onPress }: OptionButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.optionButton, selected && styles.optionButtonSelected]}
            activeOpacity={0.82}
            onPress={onPress}
        >
            <Text style={[styles.optionButtonText, selected && styles.optionButtonTextSelected]}>{label}</Text>
        </TouchableOpacity>
    )
}

// 회원정보 입력이 끝난 뒤 마이페이지에 요약 정보를 보여주는 컴포넌트입니다.
function ProfileSummarySection({
    profileInfo,
    onEditProfile,
}: {
    profileInfo: ProfileInfo
    onEditProfile: () => void
}) {
    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.summaryContent}>
            <View style={styles.summaryHeroCard}>
                <View style={styles.summaryHeaderRow}>
                    <View style={styles.avatarBox}>
                        <UserRound size={28} color="white" />
                    </View>

                    <View style={styles.summaryTitleGroup}>
                        <Text style={styles.summaryLabel}>마이페이지</Text>
                        <Text style={styles.summaryNickname}>{profileInfo.nickname}</Text>
                    </View>

                    <BadgeCheck size={28} color="#60A5FA" />
                </View>

                <Text style={styles.summaryDescription}>
                    입력한 회원정보를 바탕으로 SafeWay 맞춤 이동 서비스를 이용할 수 있어요.
                </Text>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>내 정보</Text>
                <Text style={styles.sectionDescription}>입력한 기본 회원정보입니다</Text>
            </View>

            <View style={styles.infoCard}>
                <InfoRow label="이름" value={profileInfo.name} />
                <InfoRow label="닉네임" value={profileInfo.nickname} />
                <InfoRow label="성별" value={profileInfo.gender} />
                <InfoRow label="나이" value={`${profileInfo.age}세`} />
                <InfoRow label="휠체어" value={profileInfo.wheelchairType} isLast />
            </View>

            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.86} onPress={onEditProfile}>
                <Text style={styles.secondaryButtonText}>회원정보 수정</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

// 회원정보 요약 카드에서 라벨과 값을 한 줄로 보여주는 컴포넌트입니다.
function InfoRow({ label, value, isLast = false }: InfoRowProps) {
    return (
        <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    loginContainer: {
        flex: 1,
        paddingHorizontal: 24,
        backgroundColor: "#F8FAFC",
    },
    logoSection: {
        alignItems: "center",
        paddingTop: 130,
        gap: 10,
    },
    logoBox: {
        width: 88,
        height: 88,
        borderRadius: 24,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 12 },
    },
    logoGradient: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logoTitle: {
        fontSize: 30,
        fontWeight: "900",
        color: "#111827",
        letterSpacing: 0.4,
    },
    logoDescription: {
        fontSize: 14,
        color: "#6B7280",
    },
    loginCardWrapper: {
        flex: 1,
        justifyContent: "center",
    },
    card: {
        padding: 22,
        borderRadius: 24,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E8ECF3",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 12 },
        gap: 14,
    },
    cardHighlight: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: "#EEF2FF",
    },
    loginTextGroup: {
        gap: 6,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: "#111827",
    },
    cardDescription: {
        fontSize: 13,
        color: "#6B7280",
    },
    separator: {
        height: 1,
        backgroundColor: "#E5E7EB",
    },
    primaryButton: {
        height: 52,
        borderRadius: 14,
        backgroundColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "800",
    },
    termsText: {
        fontSize: 12,
        color: "#9CA3AF",
        lineHeight: 18,
    },
    footer: {
        alignItems: "center",
        paddingBottom: 18,
    },
    footerText: {
        fontSize: 12,
        color: "#B0B7C3",
    },
    formContent: {
        padding: 24,
        paddingTop: 56,
        gap: 18,
    },
    summaryContent: {
        flexGrow: 1,
        paddingHorizontal: 18,
        paddingTop: 28,
        paddingBottom: 110,
        gap: 16,
    },
    pageHeader: {
        gap: 8,
    },
    pageTitle: {
        fontSize: 26,
        fontWeight: "900",
        color: "#111827",
    },
    pageDescription: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 21,
    },
    formCard: {
        padding: 20,
        borderRadius: 24,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        gap: 18,
    },
    fieldGroup: {
        gap: 8,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: "800",
        color: "#111827",
    },
    textInput: {
        height: 50,
        borderWidth: 1,
        borderColor: "#DDE3EC",
        borderRadius: 14,
        paddingHorizontal: 14,
        color: "#111827",
        fontSize: 15,
        backgroundColor: "#F9FAFB",
    },
    optionRow: {
        flexDirection: "row",
        gap: 10,
    },
    optionButton: {
        flex: 1,
        height: 46,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#DDE3EC",
        backgroundColor: "#F9FAFB",
        alignItems: "center",
        justifyContent: "center",
    },
    optionButtonSelected: {
        borderColor: "#2563EB",
        backgroundColor: "#EFF6FF",
    },
    optionButtonText: {
        color: "#4B5563",
        fontWeight: "800",
    },
    optionButtonTextSelected: {
        color: "#1D4ED8",
    },
    errorText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#DC2626",
    },
    summaryHeroCard: {
        padding: 22,
        borderRadius: 28,
        backgroundColor: "#0F172A",
        shadowColor: "#0F172A",
        shadowOpacity: 0.16,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        gap: 16,
    },
    summaryHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    avatarBox: {
        width: 54,
        height: 54,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2563EB",
    },
    summaryTitleGroup: {
        flex: 1,
        gap: 4,
    },
    summaryLabel: {
        fontSize: 13,
        color: "#93C5FD",
        fontWeight: "800",
    },
    summaryNickname: {
        fontSize: 24,
        color: "white",
        fontWeight: "900",
    },
    summaryDescription: {
        fontSize: 14,
        color: "#CBD5E1",
        lineHeight: 21,
    },
    sectionHeader: {
        paddingHorizontal: 4,
        gap: 4,
    },
    sectionTitle: {
        paddingTop: 30,
        fontSize: 21,
        fontWeight: "900",
        color: "#111827",
    },
    sectionDescription: {
        fontSize: 13,
        color: "#6B7280",
    },
    infoCard: {
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 28,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#0F172A",
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F7",
    },
    infoRowLast: {
        borderBottomWidth: 0,
    },
    infoLabel: {
        fontSize: 15,
        color: "#6B7280",
        fontWeight: "700",
    },
    infoValue: {
        fontSize: 17,
        color: "#111827",
        fontWeight: "700",
    },
    secondaryButton: {
        height: 58,
        borderRadius: 18,
        backgroundColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#2563EB",
        shadowOpacity: 0.18,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
    },
    secondaryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "800",
    },
})
