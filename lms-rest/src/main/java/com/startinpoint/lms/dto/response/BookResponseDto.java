package com.startinpoint.lms.dto.response;

import lombok.Builder;

@Builder
public record BookResponseDto(
    Long id,
    String title,
    String author,
    String imageUrl,
    String genre,
    String description,
    Integer stock,
    Boolean available
) {}
