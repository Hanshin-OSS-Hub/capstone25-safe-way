package com.safeway.backend.service.dto;

import com.safeway.backend.domain.Favorite;
import io.swagger.v3.oas.annotations.media.Schema;

// 즐겨찾기 API가 프론트에 돌려주는 응답 JSON 구조입니다.
@Schema(description = "즐겨찾기 응답")
public record FavoriteResponse(
        @Schema(description = "즐겨찾기 ID", example = "1")
        Long favoriteId,

        @Schema(description = "즐겨찾기 이름", example = "집")
        String favorName,

        @Schema(description = "즐겨찾기 대상 노드 ID", example = "123")
        Long targetNodeId
) {
    // DB 엔티티인 Favorite을 API 응답 DTO로 바꿉니다.
    public static FavoriteResponse from(Favorite favorite) {
        return new FavoriteResponse(
                favorite.getFavorId(),
                favorite.getFavorName(),
                favorite.getTargetNode().getNodeId()
        );
    }
}
