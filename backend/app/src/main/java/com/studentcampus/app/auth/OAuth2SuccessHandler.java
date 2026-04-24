package com.studentcampus.app.auth;

import com.studentcampus.app.common.JwtUtil;
import com.studentcampus.app.model.User;
import com.studentcampus.app.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    private static final String FRONTEND_URL = "http://localhost:5173";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {

        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();

        String googleId = oidcUser.getSubject();
        String email    = oidcUser.getEmail();
        String name     = oidcUser.getFullName();
        String picture  = oidcUser.getPicture();

        log.info("OAuth2 login success for: {}", email);

        // Check BEFORE saving whether this is a brand-new user
        boolean isNewUser = !userService.existsByGoogleId(googleId);

        // Save or update user in MongoDB
        User user = userService.findOrCreateUser(googleId, email, name, picture);

        // -------------------------------------------------------
        // ROUTING LOGIC
        // -------------------------------------------------------

        // 1. First-time login → redirect to registration page
        //    User must select their type: Student / Staff / Technician
        if (isNewUser) {
            String tempToken = jwtUtil.generateToken(user);
            log.info("New user — redirecting to registration: {}", email);
            response.sendRedirect(FRONTEND_URL + "/auth/register?token=" + tempToken);
            return;
        }

        // 2. Account is PENDING (Staff/Technician waiting for admin approval)
        if (user.getAccountStatus() == User.AccountStatus.PENDING) {
            log.info("Pending account — redirecting to pending page: {}", email);
            response.sendRedirect(FRONTEND_URL + "/auth/pending?email=" + email);
            return;
        }

        // 3. Account was REJECTED by admin
        if (user.getAccountStatus() == User.AccountStatus.REJECTED) {
            log.info("Rejected account — redirecting to rejected page: {}", email);
            response.sendRedirect(FRONTEND_URL + "/auth/rejected?email=" + email);
            return;
        }

        // 4. Account is DEACTIVATED by admin
        if (user.getAccountStatus() == User.AccountStatus.DEACTIVATED || !user.isActive()) {
            log.info("Deactivated account — redirecting to rejected page: {}", email);
            response.sendRedirect(FRONTEND_URL + "/auth/rejected");
            return;
        }

        // 5. Normal active user → generate JWT and redirect to dashboard
        String token = jwtUtil.generateToken(user);
        log.info("Active user — redirecting to dashboard: {}", email);
        response.sendRedirect(FRONTEND_URL + "/auth/callback?token=" + token);
    }
}