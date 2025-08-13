package com.cms.auth.controller;

import com.cms.auth.model.LoginRequest;
import com.cms.auth.model.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank() ||
            request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        // Simple role logic for demo: admin -> Admin with MFA; else Supervisor
        String role = request.getUsername().equalsIgnoreCase("admin") ? "Admin" : "Supervisor";
        String displayName = request.getUsername().equalsIgnoreCase("admin") ? "Administrator" : ("Inspector " + request.getUsername());
        String token = "demo-token-" + request.getUsername();

        UserResponse resp = new UserResponse(request.getUsername(), role, displayName, true, token);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/me")
    public Map<String, Object> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return Map.of(
                "authenticated", authHeader != null && !authHeader.isBlank(),
                "token", authHeader
        );
    }
}