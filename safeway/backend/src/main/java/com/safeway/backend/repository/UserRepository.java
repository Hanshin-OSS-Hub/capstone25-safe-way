package com.safeway.backend.repository;

import com.safeway.backend.domain.user.User;
import com.safeway.backend.domain.user.UserSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // 카카오 로그인 시 기존 가입 여부 확인을 위한 메서드
    Optional<User> findByKakaoId(Long kakaoId);

    // 로컬 로그인용 (나중에 쓸 수도 있으니)
    Optional<User> findByLoginId(String loginId);

    public interface UserSettingRepository extends JpaRepository<UserSetting, Long> { }
}