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

    // Frontend URL to redirect after login
    private static final String FRONTEND_URL = "http://localhost:5173";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {

        // Get Google user info from OAuth2
        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();

        String googleId = oidcUser.getSubject();
        String email    = oidcUser.getEmail();
        String name     = oidcUser.getFullName();
        String picture  = oidcUser.getPicture();

        log.info("OAuth2 login success for: {}", email);

        // Save or update user in MongoDB
        User user = userService.findOrCreateUser(googleId, email, name, picture);

        // Generate JWT token for the user
        String token = jwtUtil.generateToken(user);

        // Redirect to frontend with token as URL parameter
        // Frontend will extract the token and store it
        String redirectUrl = FRONTEND_URL + "/auth/callback?token=" + token;
        response.sendRedirect(redirectUrl);
    }
}