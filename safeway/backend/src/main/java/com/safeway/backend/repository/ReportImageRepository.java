package com.safeway.backend.repository;

import com.safeway.backend.domain.ReportImage;
import org.springframework.data.jpa.repository.JpaRepository;

// 신고 이미지 엔티티 저장 및 조회를 담당한다.
public interface ReportImageRepository extends JpaRepository<ReportImage, Long> {
}
