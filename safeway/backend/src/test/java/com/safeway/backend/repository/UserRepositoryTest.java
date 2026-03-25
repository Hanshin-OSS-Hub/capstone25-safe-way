package com.safeway.backend.repository;

import com.safeway.backend.domain.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
// 실제 PostgreSQL을 쓰고 계시니 이 설정은 필수입니다.
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("유저 저장 테스트")
    void saveUserTest() {
        // 엔티티 필드명: userName, loginId 사용
        User user = User.builder()
                .userName("Fujin")
                .loginId("fujin_test_01")
                .role("ROLE_USER")
                .build();

        User savedUser = userRepository.save(user);

        assertThat(savedUser.getUserName()).isEqualTo("Fujin");
        assertThat(savedUser.getUserId()).isNotNull();
    }
}