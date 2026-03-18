package com.safeway.backend.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @NoArgsConstructor
public class KakaoUserResponse {
    private Long id; // 카카오 고유번호 (BIGINT 대응)

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    @Getter @NoArgsConstructor
    public static class KakaoAccount {
        private Profile profile;

        @Getter @NoArgsConstructor
        public static class Profile {
            private String nickname;
        }
    }
}