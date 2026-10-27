package com.bank.service;

import com.bank.dto.LoginRequest;
import com.bank.dto.LoginResponse;
import com.bank.entity.User;
import com.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {

        // Step 1 — Find user by username
        Optional<User> userOptional =
                userRepository.findByUsername(request.getUsername());

        // Step 2 — Check if user exists
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid username or password");
        }

        User user = userOptional.get();

        // Step 3 — Check if password matches
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        // Step 4 — Return login response with role info
        return new LoginResponse(
                "Login successful",
                user.getRole(),
                user.getUsername(),
                user.getReferenceId()
        );
    }
}