package com.studentcampus.app.common;

import com.studentcampus.app.common.security.UserPrincipal;
import com.studentcampus.app.model.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Check if Authorization header exists and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                String userId        = jwtUtil.extractUserId(token);
                String email         = jwtUtil.extractEmail(token);
                String name          = jwtUtil.extractName(token);      // ✅ available
                String picture       = jwtUtil.extractPicture(token);   // ✅ available
                Set<User.Role> roles = jwtUtil.extractRoles(token);

                // Convert roles to Spring Security authorities
                var authorities = roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                        .collect(Collectors.toList());

                // Build UserPrincipal with all user info from token
                UserPrincipal userPrincipal = UserPrincipal.builder()
                        .id(userId)
                        .email(email)
                        .name(name)
                        .picture(picture)
                        .roles(roles)
                        .authorities(authorities)
                        .build();

                // Create authentication object with UserPrincipal as principal
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userPrincipal,  // ← Principal is now UserPrincipal object
                                null,           // ← credentials not needed after auth
                                authorities);

                // Set in security context — marks request as authenticated
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("Authenticated user: {} with roles: {}", email, roles);
            }
        }

        filterChain.doFilter(request, response);
    }
}