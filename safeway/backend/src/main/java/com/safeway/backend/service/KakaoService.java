package com.safeway.backend.service;
import com.safeway.backend.service.dto.KakaoUserResponse;
import com.safeway.backend.service.dto.PlaceSearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KakaoService {

    private final WebClient webClient; // WebClientConfig에서 등록한 빈 주입

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

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
        formData.add("client_id", kakaoClientId); // REST API 키
        formData.add("redirect_uri", kakaoRedirectUri);
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
                .header("Authorization", "KakaoAK " + kakaoRestApiKey)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    @SuppressWarnings("unchecked")
    public List<PlaceSearchResponse> searchPlaces(String keyword) {
        // 1. 카카오 API 호출 (WebClient 사용)
        Map<String, Object> response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("dapi.kakao.com")
                        .path("/v2/local/search/keyword.json")
                        .queryParam("query", keyword) // 사용자가 입력한 키워드 (예: 병점역)
                        .build())
                .header("Authorization", "KakaoAK " + kakaoRestApiKey) // 기존 키 사용
                .retrieve()
                .bodyToMono(Map.class)
                .block(); // 결과를 기다림

        // 2. 결과 데이터(documents) 추출
        // 카카오는 검색 결과를 "documents"라는 키값에 리스트로 담아줍니다.
        List<Map<String, Object>> documents = (List<Map<String, Object>>) response.get("documents");

        // 3. 받은 결과를 PlaceSearchResponse DTO 리스트로 변환
        return documents.stream().map(doc -> PlaceSearchResponse.builder()
                .placeName((String) doc.get("place_name"))
                .addressName((String) doc.get("address_name"))
                .roadAddressName((String) doc.get("road_address_name"))
                .lon((String) doc.get("x")) // 카카오 x = 경도
                .lat((String) doc.get("y")) // 카카오 y = 위도
                .categoryName((String) doc.get("category_name"))
                .build()
        ).collect(Collectors.toList());
    }
}
