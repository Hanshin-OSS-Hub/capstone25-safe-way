package com.safeway.backend.service;

import com.safeway.backend.domain.user.AuthType;
import com.safeway.backend.domain.user.User;
import com.safeway.backend.domain.user.UserSetting;
import com.safeway.backend.repository.UserRepository;
import com.safeway.backend.security.JwtTokenProvider;
import com.safeway.backend.service.dto.KakaoUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final KakaoService kakaoService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public String kakaoLogin(String accessToken) {
        // 1. 카카오 서버에서 유저 정보 획득
        KakaoUserResponse userInfo = kakaoService.getUserInfo(accessToken);

        // 2. DB 확인 및 신규 가입 처리
        User user = userRepository.findByKakaoId(userInfo.getId())
                .orElseGet(() -> {
                    // 신규 유저 생성
                    User newUser = User.builder()
                            .kakaoId(userInfo.getId())
                            .userName(userInfo.getKakaoAccount().getProfile().getNickname())
                            .authType(AuthType.KAKAO)
                            .role("ROLE_USER")
                            .build();

                    // 유저 저장 (Cascade 옵션이 없다면 UserSetting도 같이 초기화)
                    return userRepository.save(newUser);
                });

        // 3. 우리 서비스 전용 JWT 토큰 생성 및 반환
        return jwtTokenProvider.createToken(user.getUserId(), user.getRole());
    }
}