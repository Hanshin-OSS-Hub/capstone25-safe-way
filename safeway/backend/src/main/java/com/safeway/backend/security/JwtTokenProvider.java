package com.safeway.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    private final long validityInMilliseconds = 1000L * 60 * 60 * 24; // 24시간
    private SecretKey key; // 0.12 버전에서는 SecretKey 타입을 권장

    @PostConstruct
    protected void init() {
        // secretKey가 32바이트(256비트)보다 짧으면 에러가 날 수 있으니 주의하세요.
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // 1. 토큰 생성
    public String createToken(Long userId, String role) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .subject(userId.toString())        // setSubject 대신 subject()
                .claim("role", role)               // 별도의 Claims 객체 생성 없이 바로 추가 가능
                .issuedAt(now)                     // setIssuedAt 대신 issuedAt()
                .expiration(validity)              // setExpiration 대신 expiration()
                .signWith(key)                     // 알고리즘은 key에 맞춰 자동으로 선택됨
                .compact();
    }

    // 2. 토큰에서 인증 정보 조회
    public Authentication getAuthentication(String token) {
        String userId = this.getUserId(token);
        User principal = new User(userId, "", Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        return new UsernamePasswordAuthenticationToken(principal, token, principal.getAuthorities());
    }

    // 3. 토큰에서 유저 ID 추출
    public String getUserId(String token) {
        return Jwts.parser()                       // parserBuilder() 대신 parser()
                .verifyWith(key)                   // setSigningKey 대신 verifyWith()
                .build()
                .parseSignedClaims(token)          // parseClaimsJws 대신 parseSignedClaims()
                .getPayload()                      // getBody 대신 getPayload()
                .getSubject();
    }

    // 4. 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // 서명 오류, 만료, 형식이 맞지 않는 토큰 등은 여기서 모두 걸러집니다.
            return false;
        }
    }
}