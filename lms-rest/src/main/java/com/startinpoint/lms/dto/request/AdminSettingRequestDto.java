package com.startinpoint.lms.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AdminSettingRequestDto(
  @NotBlank(message = "Category Name shouldn't be blank.")
  String categoryName,
  @NotBlank(message = "Label shouldn't be blank.")
  String label,
  @NotBlank(message = "Value shouldn't be blank.")
  String value
) {}

