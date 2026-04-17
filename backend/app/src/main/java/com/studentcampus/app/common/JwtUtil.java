package com.studentcampus.app.common;

import com.studentcampus.app.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Build signing key from secret
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // Generate JWT token after Google login
    public String generateToken(User user) {
        String roles = user.getRoles()
                .stream()
                .map(Enum::name)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .setSubject(user.getId())           // user MongoDB ID
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .claim("picture", user.getProfilePicture())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract user ID from token
    public String extractUserId(String token) {
        return parseClaims(token).getSubject();
    }

    // Extract email from token
    public String extractEmail(String token) {
        return (String) parseClaims(token).get("email");
    }

    // Extract name from token
    public String extractName(String token) {
        return (String) parseClaims(token).get("name");
    }

    // Extract profile picture from token
    public String extractPicture(String token) {
        return (String) parseClaims(token).get("picture");
    }

    // Extract roles from token
    public Set<User.Role> extractRoles(String token) {
        String roles = (String) parseClaims(token).get("roles");
        return java.util.Arrays.stream(roles.split(","))
                .map(User.Role::valueOf)
                .collect(Collectors.toSet());
    }

    // Validate token — returns true if valid
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("JWT unsupported: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("JWT malformed: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT empty: {}", e.getMessage());
        }
        return false;
    }

    // Internal — parse and return all claims
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}