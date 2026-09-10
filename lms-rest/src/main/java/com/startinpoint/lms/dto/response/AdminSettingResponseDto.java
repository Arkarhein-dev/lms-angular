package com.startinpoint.lms.dto.response;

import lombok.Builder;

@Builder
public record AdminSettingResponseDto(
  String id,
  String categoryName,
  String label,
  String value,
  String createdAt,
  String createdBy
) {
}
