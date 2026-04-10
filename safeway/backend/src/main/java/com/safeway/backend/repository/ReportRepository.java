package com.safeway.backend.repository;

import com.safeway.backend.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;

// 신고 엔티티의 기본 CRUD와 조회 확장을 담당한다.
public interface ReportRepository extends JpaRepository<Report, Long> {
}
