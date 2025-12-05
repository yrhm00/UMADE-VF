package com.umade.auth;

import com.umade.users.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    public record RegisterRequest(
            @Email String email,
            @NotBlank String password,
            @NotBlank String firstName,
            @NotBlank String lastName,
            UserRole role) {
    }

    public record AuthResponse(String token) {
    }

    public record LoginRequest(
            @Email String email,
            @NotBlank String password) {
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        String token = authService.register(req);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        String token = authService.login(req.email(), req.password());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}