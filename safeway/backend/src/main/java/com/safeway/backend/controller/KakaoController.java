package com.safeway.backend.controller;

import com.safeway.backend.service.AuthService;
import com.safeway.backend.service.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
//@RequestMapping("/auth/kakao")
@RequiredArgsConstructor
public class KakaoController {

    private final AuthService authService;
    private final KakaoService kakaoService;

    @PostMapping("/auth/kakao/login")
    public String login(@RequestBody Map<String, String> request) {
        String accessToken = request.get("accessToken");
        return authService.kakaoLogin(accessToken);
    }

    @GetMapping("/callback")
    public String kakaoCallback(@RequestParam String code) {
        // 1. 인가 코드로 액세스 토큰 획득
        String accessToken = kakaoService.getAccessToken(code);

        // 2. 서비스 로그인 및 JWT 발급
        return authService.kakaoLogin(accessToken);
    }
}