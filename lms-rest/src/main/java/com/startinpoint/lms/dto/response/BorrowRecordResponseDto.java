package com.startinpoint.lms.dto.response;

import com.startinpoint.lms.entity.BorrowStatus;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record BorrowRecordResponseDto(
        Long id,
        Long bookId,
        String bookTitle,
        String bookAuthor,
        String bookImage,
        Long userId,
        LocalDate borrowDate,
        LocalDate dueDate,
        LocalDate returnedDate,
        BorrowStatus status
) {
}
