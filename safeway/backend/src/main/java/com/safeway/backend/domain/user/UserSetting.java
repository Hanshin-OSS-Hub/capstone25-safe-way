package com.safeway.backend.domain.user;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_settings")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserSetting {

    @Id
    private Long userId; // User의 userId를 PK로 공유

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // User의 PK를 이 엔티티의 PK이자 FK로 사용 (SQL의 제약 조건 반영)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 1)
    private String wheelchairType;

    @Column(name = "max_slope_limit")
    private Double maxSlopeLimit;
}