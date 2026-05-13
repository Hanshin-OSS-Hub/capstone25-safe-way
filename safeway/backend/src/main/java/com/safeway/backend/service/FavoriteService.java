package com.safeway.backend.service;

import com.safeway.backend.domain.Favorite;
import com.safeway.backend.domain.Node;
import com.safeway.backend.domain.user.User;
import com.safeway.backend.repository.FavoriteRepository;
import com.safeway.backend.repository.NodeRepository;
import com.safeway.backend.repository.UserRepository;
import com.safeway.backend.service.dto.FavoriteCreateRequest;
import com.safeway.backend.service.dto.FavoriteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final NodeRepository nodeRepository;

    // userId 기준으로 DB에서 즐겨찾기를 가져오고, API 응답 DTO로 변환합니다.
    @Transactional(readOnly = true)
    public List<FavoriteResponse> getFavorites(Long userId) {
        return favoriteRepository.findByUser_UserIdOrderByFavorIdAsc(userId).stream()
                .map(FavoriteResponse::from)
                .toList();
    }

    // 사용자와 목적지 노드를 확인한 뒤, 중복 즐겨찾기가 아니면 새 Favorite을 저장합니다.
    public FavoriteResponse createFavorite(Long userId, FavoriteCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        Node targetNode = nodeRepository.findById(request.targetNodeId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 노드입니다."));

        if (favoriteRepository.existsByUser_UserIdAndTargetNode_NodeId(userId, request.targetNodeId())) {
            throw new IllegalArgumentException("이미 등록된 즐겨찾기입니다.");
        }

        Favorite favorite = Favorite.create(user, request.favorName(), targetNode);
        return FavoriteResponse.from(favoriteRepository.save(favorite));
    }

    // 삭제 요청한 즐겨찾기가 로그인 사용자의 소유인지 확인한 뒤 삭제합니다.
    public void deleteFavorite(Long userId, Long favoriteId) {
        Favorite favorite = favoriteRepository.findById(favoriteId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 즐겨찾기입니다."));

        if (!favorite.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("해당 즐겨찾기에 접근할 수 없습니다.");
        }

        favoriteRepository.delete(favorite);
    }
}
