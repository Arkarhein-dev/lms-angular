package com.startinpoint.lms.controller;

import com.startinpoint.lms.dto.request.BookReturnRequestDto;
import com.startinpoint.lms.dto.request.BorrowRecordRequestDto;
import com.startinpoint.lms.dto.response.BorrowRecordResponseDto;
import com.startinpoint.lms.entity.BorrowStatus;
import com.startinpoint.lms.service.BookService;
import com.startinpoint.lms.service.BorrowRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/borrow-records")
public class BorrowRecordController {
  private final BorrowRecordService borrowRecordService;
  private final BookService bookService;

  @GetMapping
  public ResponseEntity<Page<BorrowRecordResponseDto>> getBorrowRecords(
    @PageableDefault(page=0, size=100, sort = "id", direction = Sort.Direction.ASC)Pageable pageable,
    @RequestParam(value = "keyword", required = false) String keyword,
    @RequestParam(value = "status", required = false) BorrowStatus status,
    Authentication authentication
  ){
    String username = authentication.getName();
    System.out.println("username : "+ username);

    if (keyword != null && keyword.trim().isEmpty()){
      return ResponseEntity.ok(borrowRecordService.fetchBorrowRecordByKeyword(keyword,username,status,pageable));
    }
    return ResponseEntity.ok(borrowRecordService.getUserActiveBorrowRecords(username,status,pageable));
  }

  @PostMapping("/borrow-book")
  public ResponseEntity<BorrowRecordResponseDto> borrowBook(
    @Valid @RequestBody BorrowRecordRequestDto requestDto,
    @RequestParam(value = "dueDate", defaultValue = "14") Integer borrowDays,
    Authentication authentication
  ){
    String username = authentication.getName();

    BorrowRecordResponseDto responseDto = bookService.borrowBook(requestDto.bookId(),username,borrowDays);
    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
  }

  @PostMapping("/return-book")
  public ResponseEntity<BorrowRecordResponseDto> returnBook(
    @Valid @RequestBody BookReturnRequestDto dto
  ){
      return ResponseEntity.ok(bookService.returnBook(dto.recordId()));
  }

}
