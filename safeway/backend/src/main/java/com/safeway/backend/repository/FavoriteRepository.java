package com.safeway.backend.repository;

import com.safeway.backend.domain.Favorite;
import com.safeway.backend.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);

    // 특정 사용자의 즐겨찾기 목록을 favorId 오름차순으로 조회합니다.
    List<Favorite> findByUser_UserIdOrderByFavorIdAsc(Long userId);

    // 같은 사용자가 같은 노드를 이미 즐겨찾기했는지 확인합니다.
    boolean existsByUser_UserIdAndTargetNode_NodeId(Long userId, Long targetNodeId);
}
