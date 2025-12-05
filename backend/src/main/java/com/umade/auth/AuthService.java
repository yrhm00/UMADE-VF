package com.umade.auth;

import com.umade.users.User;
import com.umade.users.UserRepository;
import com.umade.users.UserRole;
import com.umade.analytics.AnalyticsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AnalyticsService analyticsService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository,
            JwtService jwtService,
            AnalyticsService analyticsService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.analyticsService = analyticsService;
    }

    public String register(AuthController.RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        User user = new User();
        user.setEmail(req.email());
        user.setPasswordHash(encoder.encode(req.password()));
        user.setFirstName(req.firstName());
        user.setLastName(req.lastName());
        user.setRole(req.role() != null ? req.role() : UserRole.CLIENT);

        userRepository.save(user);

        analyticsService.trackEvent(user.getId().toString(), "Signup Completed", Map.of(
                "role", user.getRole().name(),
                "email", user.getEmail()
        ));

        return jwtService.generateToken(user);
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Identifiants invalides"));

        if (!encoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Identifiants invalides");
        }

        return jwtService.generateToken(user);
    }
}