package com.startinpoint.lms.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record BookReturnRequestDto(
  @NotNull(message = "Record Id should not be null")
  Long recordId
) {
}
