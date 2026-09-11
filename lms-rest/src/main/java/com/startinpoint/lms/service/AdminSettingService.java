package com.startinpoint.lms.service;

import com.startinpoint.lms.dto.request.AdminSettingRequestDto;
import com.startinpoint.lms.dto.response.AdminSettingResponseDto;
import com.startinpoint.lms.entity.AdminSetting;
import com.startinpoint.lms.exception.BadRequestException;
import com.startinpoint.lms.exception.ResourceNotFoundException;
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

  public AdminSettingResponseDto createSetting(AdminSettingRequestDto requestDto){
    if(adminSettingRepository.existsByLabel(requestDto.label())){
      throw new BadRequestException("Label Already Exists");
    }
    AdminSetting newAdminSetting = adminSettingMapper.toAdminSetting(requestDto);
    return adminSettingMapper.toResponseDto(adminSettingRepository.save(newAdminSetting));
  }

  public AdminSettingResponseDto updateSetting(Long id, AdminSettingRequestDto requestDto){
    AdminSetting adminSetting = adminSettingRepository.findById(id).orElseThrow(() ->  new ResourceNotFoundException("The setting with that Id : "+ id + " can't be found."));
    adminSettingMapper.updateAdminSettingFromDto(requestDto, adminSetting); // update via mapper

    return adminSettingMapper.toResponseDto(adminSettingRepository.save(adminSetting));
  }

  public void deleteSetting(Long id){
    if(!adminSettingRepository.existsById(id)){
      throw new ResourceNotFoundException("Admin Setting with the id "+ id +" can't be found.");
    }
    adminSettingRepository.deleteById(id);
  }
}
