package com.startinpoint.lms.controller;

import com.startinpoint.lms.dto.authDto.AuthResponseDto;
import com.startinpoint.lms.dto.authDto.LoginRequestDto;
import com.startinpoint.lms.dto.authDto.RegisterRequestDto;
import com.startinpoint.lms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@CrossOrigin(value = "http://localhost:4200")
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<AuthResponseDto> register( @Valid @RequestBody RegisterRequestDto requestDto){
    return ResponseEntity.ok(authService.register(requestDto));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponseDto> login( @Valid @RequestBody LoginRequestDto requestDto){
    return ResponseEntity.ok(authService.login(requestDto));
  }

}
