package com.bank.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String message;
    private String role;
    private String username;
    private Integer referenceId;
}
