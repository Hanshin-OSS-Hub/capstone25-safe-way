package com.safeway.backend.repository;

import com.safeway.backend.domain.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

// 신고 검증 결과 엔티티의 기본 CRUD를 제공한다.
public interface VerificationRepository extends JpaRepository<Verification, Long> {
}
