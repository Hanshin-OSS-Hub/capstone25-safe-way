package com.safeway.backend.domain;

import com.safeway.backend.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "favorites")
@Getter
@NoArgsConstructor
public class Favorite {

    // 즐겨찾기 항목 자체의 고유 ID입니다.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long favorId;

    // 이 즐겨찾기를 소유한 사용자입니다. DB의 user_id와 연결됩니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 사용자가 정한 즐겨찾기 이름입니다.
    @Column(nullable = false, length = 100)
    private String favorName;

    // 즐겨찾기로 저장된 목적지 노드입니다. DB의 target_node_id와 연결됩니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_node_id", nullable = false)
    private Node targetNode;

    private Favorite(User user, String favorName, Node targetNode) {
        this.user = user;
        this.favorName = favorName;
        this.targetNode = targetNode;
    }

    // 새 즐겨찾기 엔티티를 만들 때 사용하는 생성 메서드입니다.
    public static Favorite create(User user, String favorName, Node targetNode) {
        return new Favorite(user, favorName, targetNode);
    }
}
