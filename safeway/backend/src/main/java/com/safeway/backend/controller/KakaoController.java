package com.safeway.backend.controller;

import com.safeway.backend.service.AuthService;
import com.safeway.backend.service.KakaoService;
import com.safeway.backend.service.dto.PlaceSearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    /**
     * 좌표로 현재 위치 정보 반환
     * @param x 경도(127.xxx)
     * @param y 위도(37.xxx)
     * @return 현재 위치 정보(도,시,주소)
     */
    @GetMapping("/api/location/address")
    public Map<String, Object> getAddress(@RequestParam String x, @RequestParam String y) {
        return kakaoService.getAddressFromCoords(x, y);
    }

    /**
     * 키워드로 장소 검색 (카카오 로컬 API 중계)
     * @param keyword 검색어 (예: 병점역, 강남역 맛집 등)
     * @return 검색된 장소 리스트 (이름, 주소, 좌표 포함)
     */
    @GetMapping("/api/location/search")
    public ResponseEntity<List<PlaceSearchResponse>> search(@RequestParam String keyword) {
        // 서비스에서 이미 WebClient로 카카오 호출하고 DTO 변환까지 다 해서 줍니다.
        List<PlaceSearchResponse> results = kakaoService.searchPlaces(keyword);
        return ResponseEntity.ok(results);
    }
}