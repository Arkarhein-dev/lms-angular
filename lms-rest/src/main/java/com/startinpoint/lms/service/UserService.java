package com.startinpoint.lms.service;

import com.startinpoint.lms.dto.response.UserResponseDto;
import com.startinpoint.lms.entity.User;
import com.startinpoint.lms.mapper.UserMapper;
import com.startinpoint.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public Page<UserResponseDto> getAllUsers(
      Pageable pageable
    ){
      return userRepository.findAll(pageable).map(userMapper::toResponseDto);
    }

    public UserResponseDto getUserById(Long userId){
      return userMapper.toResponseDto(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found.")));
    }
}
