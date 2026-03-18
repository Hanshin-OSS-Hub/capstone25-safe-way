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

import java.security.Key;
import java.util.Collections;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    private final long validityInMilliseconds = 1000L * 60 * 60 * 24; // 24시간
    private Key key;

    @PostConstruct
    protected void init() {
        // secretKey를 사용해 암호화 키 초기화
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // 1. 토큰 생성
    public String createToken(Long userId, String role) {
        Claims claims = Jwts.claims().setSubject(userId.toString());
        claims.put("role", role);
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + validityInMilliseconds))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 2. 토큰에서 인증 정보 조회 (이게 없어서 빨간줄이었음)
    public Authentication getAuthentication(String token) {
        String userId = this.getUserId(token);
        // 시큐리티에서 쓸 유저 객체 생성
        User principal = new User(userId, "", Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        return new UsernamePasswordAuthenticationToken(principal, token, principal.getAuthorities());
    }

    // 3. 토큰에서 유저 ID 추출
    public String getUserId(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // 4. 토큰 유효성 검사 (이게 없어서 빨간줄이었음)
    public boolean validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}