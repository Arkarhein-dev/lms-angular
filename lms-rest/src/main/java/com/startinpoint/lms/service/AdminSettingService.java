package com.startinpoint.lms.service;

import com.startinpoint.lms.dto.response.AdminSettingResponseDto;
import com.startinpoint.lms.entity.AdminSetting;
import com.startinpoint.lms.mapper.AdminSettingMapper;
import com.startinpoint.lms.repository.AdminSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminSettingService {
  private final AdminSettingRepository adminSettingRepository;
  private final AdminSettingMapper adminSettingMapper;

  public Page<AdminSettingResponseDto> getAllAdminSettings(Pageable pageable){
    return adminSettingRepository.findAll(pageable).map(adminSettingMapper::toResponseDto);
  }
}
