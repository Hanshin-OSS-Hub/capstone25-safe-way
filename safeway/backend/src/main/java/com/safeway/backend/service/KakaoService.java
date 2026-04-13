package com.safeway.backend.service;
import com.safeway.backend.service.dto.KakaoUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class KakaoService {

    private final WebClient webClient; // WebClientConfig에서 등록한 빈 주입

    public KakaoUserResponse getUserInfo(String accessToken) {
        return webClient.get()
                .uri("https://kapi.kakao.com/v2/user/me")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(KakaoUserResponse.class)
                .block(); // 실무에서는 예외 처리가 필수지만, 우선 동작 위주로 구성
    }
    // 인가 코드를 카카오 서버에 주고 액세스 토큰을 받아오는 로직
    public String getAccessToken(String code) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("client_id", "REMOVED"); // REST API 키
        formData.add("redirect_uri", "http://localhost:8080/callback");
        formData.add("code", code);

        Map response = webClient.post()
                .uri("https://kauth.kakao.com/oauth/token")
                .header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return response.get("access_token").toString();
    }
    @SuppressWarnings("unchecked")
    public Map<String, Object> getAddressFromCoords(String x, String y) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("dapi.kakao.com")
                        .path("/v2/local/geo/coord2address.json")
                        .queryParam("x", x) // 경도
                        .queryParam("y", y) // 위도
                        .build())
                .header("Authorization", "KakaoAK REMOVED")
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}