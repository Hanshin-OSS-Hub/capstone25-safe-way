package com.safeway.backend.repository;

import com.safeway.backend.domain.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationRepository extends JpaRepository<Verification, Long> {
}
