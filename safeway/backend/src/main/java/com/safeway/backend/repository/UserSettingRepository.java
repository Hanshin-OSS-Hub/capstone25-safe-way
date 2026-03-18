package com.safeway.backend.repository;

import com.safeway.backend.domain.user.UserSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSettingRepository extends JpaRepository<UserSetting, Long> { }