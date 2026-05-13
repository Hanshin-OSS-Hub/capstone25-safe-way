package com.safeway.backend.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// 프론트가 즐겨찾기 생성 API에 보내는 요청 JSON 구조입니다.
@Schema(description = "즐겨찾기 생성 요청")
public record FavoriteCreateRequest(
        @Schema(description = "즐겨찾기 이름", example = "집")
        @NotBlank
        String favorName,

        @Schema(description = "즐겨찾기로 저장할 목적지 노드 ID", example = "123")
        @NotNull
        Long targetNodeId
) {
}
