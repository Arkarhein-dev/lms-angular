package com.startinpoint.lms.service;

import com.startinpoint.lms.config.SecurityUser;
import com.startinpoint.lms.dto.authDto.AuthResponseDto;
import com.startinpoint.lms.dto.authDto.LoginRequestDto;
import com.startinpoint.lms.dto.authDto.RegisterRequestDto;
import com.startinpoint.lms.entity.User;
import com.startinpoint.lms.entity.UserRole;
import com.startinpoint.lms.mapper.UserMapper;
import com.startinpoint.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final UserMapper userMapper;


  public AuthResponseDto register(RegisterRequestDto requestDto){
    if(userRepository.existsByEmail(requestDto.email())){
      throw new IllegalArgumentException("Email already exists");
    }
    if(userRepository.existsByUsername(requestDto.username())){
      throw new IllegalArgumentException("Username already exists");
    }

    User newUser = userMapper.toUserEntity(requestDto);
    newUser.setPassword(passwordEncoder.encode(requestDto.password()));
    newUser.setRole(UserRole.USER);
    newUser.setActive(true);

    userRepository.save(newUser);
    SecurityUser savedUser = new SecurityUser(newUser);
    String token = jwtService.generateToken(savedUser);
    return new AuthResponseDto(token);
  }

  public AuthResponseDto login(LoginRequestDto requestDto){
    Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(requestDto.username(), requestDto.password()));

    SecurityUser savedUser = (SecurityUser) authentication.getPrincipal();
    String token = jwtService.generateToken(savedUser);
    return new AuthResponseDto(token);
  }

}
