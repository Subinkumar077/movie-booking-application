package com.example.MoviesBookingApplication.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private Long userId;
    private String jwtToken;
    private String username;
    private java.util.Set<String> roles;
}
