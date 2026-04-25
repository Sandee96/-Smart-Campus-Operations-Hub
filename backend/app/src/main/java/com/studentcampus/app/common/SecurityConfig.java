package com.studentcampus.app.common;

import com.studentcampus.app.auth.OAuth2SuccessHandler;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@EnableMethodSecurity
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Return JSON 401/403 instead of redirecting to Google login page
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, exception) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write(
                                    "{\"success\":false,\"message\":\"Unauthorized\",\"data\":null}");
                        })
                        .accessDeniedHandler((request, response, exception) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write(
                                    "{\"success\":false,\"message\":\"Access Denied\",\"data\":null}");
                        }))

                .authorizeHttpRequests(auth -> auth

                        // ── Public endpoints ───────────────────────────────
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/login/oauth2/**").permitAll()
                        .requestMatchers("/oauth2/**").permitAll()
                        .requestMatchers("/auth/register/complete").permitAll()

                        // ── Resources (Module A) ───────────────────────────
                        .requestMatchers(HttpMethod.GET,    "/api/resources/**").authenticated()
                        .requestMatchers(HttpMethod.POST,   "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH,  "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/resources/**").hasRole("ADMIN")

                        // ── Bookings (Module B) ────────────────────────────
                        // QR check-in is public — the QR token itself is the auth mechanism
                        .requestMatchers(HttpMethod.POST,   "/api/bookings/checkin").permitAll()
                        // Specific paths first (must come before wildcards)
                        .requestMatchers(HttpMethod.GET,    "/api/bookings/my").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET,    "/api/bookings/{id}").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/bookings/{id}").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH,  "/api/bookings/{id}/action").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,    "/api/bookings").hasRole("ADMIN")
                        // Wildcard fallbacks
                        .requestMatchers(HttpMethod.GET,    "/api/bookings/**").authenticated()
                        .requestMatchers(HttpMethod.POST,   "/api/bookings/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/bookings/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH,  "/api/bookings/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").hasAnyRole("USER", "ADMIN")

                        // ── Tickets (Module C) ─────────────────────────────
                        .requestMatchers(HttpMethod.GET,    "/api/tickets/**").authenticated()
                        .requestMatchers(HttpMethod.POST,   "/api/tickets/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH,  "/api/tickets/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/tickets/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/tickets/**").hasAnyRole("USER", "ADMIN")

                        // ── Notifications (Module D) ───────────────────────
                        .requestMatchers("/api/notifications/**").authenticated()

                        // ── User preferences ───────────────────────────────
                        .requestMatchers("/api/users/me/**").authenticated()

                        // ── Admin panel (Module E) ─────────────────────────
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,    "/api/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/users/*/roles").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/*").hasRole("ADMIN")

                        .anyRequest().authenticated())

                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2SuccessHandler))

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}