package com.safeway.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;

// 하나의 신고에 첨부되는 이미지 메타데이터를 나타낸다.
@Entity
@Table(name = "report_images")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReportImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportImageId;

    // 하나의 신고에 여러 이미지가 달릴 수 있으므로 N:1 관계다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    // 업로드 순서를 유지하기 위한 컬럼이며 스키마 기본값 1을 그대로 반영한다.
    @Builder.Default
    @Column(nullable = false)
    private Short imageOrder = 1;

    @CreationTimestamp
    @Column(columnDefinition = "timestamptz DEFAULT now()")
    private ZonedDateTime createdAt;
}
