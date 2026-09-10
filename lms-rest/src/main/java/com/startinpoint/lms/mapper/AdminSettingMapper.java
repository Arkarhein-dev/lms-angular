package com.startinpoint.lms.mapper;

import com.startinpoint.lms.dto.request.AdminSettingRequestDto;
import com.startinpoint.lms.dto.response.AdminSettingResponseDto;
import com.startinpoint.lms.entity.AdminSetting;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AdminSettingMapper {

  @Mapping(target="id",ignore = true)
  AdminSetting toAdminSetting(AdminSettingRequestDto dto);

  AdminSettingResponseDto toResponseDto(AdminSetting adminSetting);
}
