package com.safeway.backend.domain.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;

@Entity
@Table(name = "users")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 기본 생성자 (보안상 Protected)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true, length = 50)
    private String loginId;

    @Column(unique = true)
    private Long kakaoId; // 카카오 고유 번호 (숫자)

    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuthType authType = AuthType.LOCAL;

    @Column(nullable = false, length = 50)
    private String userName;

    @Column(length = 20)
    private String phoneNumber;

    @Builder.Default
    private String role = "ROLE_USER"; // 시큐리티 권한 구분용

    @CreationTimestamp
    @Column(columnDefinition = "timestamptz DEFAULT now()")
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(columnDefinition = "timestamptz DEFAULT now()")
    private ZonedDateTime updatedAt;

    // UserSetting과의 1:1 양방향 관계 설정
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserSetting userSetting;
}