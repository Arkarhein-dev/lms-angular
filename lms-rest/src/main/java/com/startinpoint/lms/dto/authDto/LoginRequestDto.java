package com.startinpoint.lms.dto.authDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequestDto(
  @NotBlank(message = "User name can't be blank")
  @Size(min = 3, max = 10, message = "Username must be between 3 and 10")
  String username,
  @NotBlank(message = "Password Can't be Blank")
  @Size(min = 5, message = "Password must be at least 5 character")
  String password
) {
}
