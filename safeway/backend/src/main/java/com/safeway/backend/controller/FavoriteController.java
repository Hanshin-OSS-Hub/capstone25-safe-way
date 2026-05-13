package com.safeway.backend.controller;

import com.safeway.backend.service.FavoriteService;
import com.safeway.backend.service.dto.FavoriteCreateRequest;
import com.safeway.backend.service.dto.FavoriteResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Favorites", description = "즐겨찾기 API")
@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // 현재 로그인한 사용자의 즐겨찾기 목록을 조회하는 API입니다.
    @Operation(summary = "즐겨찾기 목록 조회", description = "로그인한 사용자의 즐겨찾기 목록을 조회합니다.")
    @GetMapping
    public List<FavoriteResponse> getFavorites(@AuthenticationPrincipal UserDetails userDetails) {
        return favoriteService.getFavorites(getUserId(userDetails));
    }

    // 요청 body로 받은 즐겨찾기 이름과 목적지 노드 ID를 로그인 사용자에게 저장합니다.
    @Operation(summary = "즐겨찾기 생성", description = "로그인한 사용자에게 목적지 노드를 즐겨찾기로 등록합니다.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FavoriteResponse createFavorite(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody FavoriteCreateRequest request
    ) {
        return favoriteService.createFavorite(getUserId(userDetails), request);
    }

    // favoriteId로 즐겨찾기를 삭제하되, 로그인 사용자의 즐겨찾기인지 Service에서 확인합니다.
    @Operation(summary = "즐겨찾기 삭제", description = "로그인한 사용자의 즐겨찾기를 삭제합니다.")
    @DeleteMapping("/{favoriteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFavorite(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long favoriteId
    ) {
        favoriteService.deleteFavorite(getUserId(userDetails), favoriteId);
    }

    // JWT 인증 결과의 username에는 JwtTokenProvider에서 넣은 userId가 들어 있습니다.
    private Long getUserId(UserDetails userDetails) {
        return Long.valueOf(userDetails.getUsername());
    }
}
