package com.safeway.backend.domain;

import com.safeway.backend.domain.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;

// 사용자가 특정 길 구간(edge)에 대해 올린 신고를 나타낸다.
@Entity
@Table(name = "reports")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    // 여러 신고가 하나의 edge를 가리킬 수 있으므로 N:1 관계로 매핑한다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "edge_id", nullable = false)
    private Edge edge;

    // 여러 신고가 한 사용자에게서 생성될 수 있으므로 N:1 관계다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String reportType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // DB에는 enum 이름 그대로 저장해 상태값을 읽기 쉽게 유지한다.
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private ReportStatus status = ReportStatus.PENDING;

    // 생성 시각은 DB 기본값(now)과 Hibernate 자동 세팅 둘 다 맞춰 둔다.
    @CreationTimestamp
    @Column(columnDefinition = "timestamptz DEFAULT now()")
    private ZonedDateTime createdAt;
}
