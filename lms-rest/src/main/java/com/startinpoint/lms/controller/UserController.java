package com.startinpoint.lms.controller;

import com.startinpoint.lms.dto.response.BorrowRecordResponseDto;
import com.startinpoint.lms.dto.response.UserResponseDto;
import com.startinpoint.lms.entity.BorrowStatus;
import com.startinpoint.lms.service.BorrowRecordService;
import com.startinpoint.lms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@CrossOrigin(value="http://localhost:4200")
public class UserController {
  private final UserService userService;
  private final BorrowRecordService borrowRecordService;

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Page<UserResponseDto>> getAllUsers(
    @PageableDefault(page = 0, size = 100, sort = "id", direction = Sort.Direction.ASC) Pageable pageable
    )
  {
    Page<UserResponseDto> dtos = userService.getAllUsers(pageable);
    return ResponseEntity.ok(dtos);
  }

  @GetMapping("/{id}/borrow-records")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Page<BorrowRecordResponseDto>> getBorrowRecordByUser(
    @PathVariable("id") Long userId,
    @RequestParam(value = "keyword", required = false)String keyword,
    @RequestParam(value = "status",required = false) BorrowStatus status,
    @PageableDefault(page = 0, size = 100, sort = "id",direction = Sort.Direction.ASC) Pageable pageable
  ){

    Page<BorrowRecordResponseDto> borrowRecordsPage;
    if (keyword != null && !keyword.trim().isEmpty()){
      borrowRecordsPage = borrowRecordService.fetchBorrowRecordByUserWithKeyword(
        userId, keyword.trim(), status, pageable
      );
    } else {
      borrowRecordsPage = borrowRecordService.fetchBorrowRecordByUser(
        userId, status, pageable
      );
    }

    return ResponseEntity.ok(borrowRecordsPage);
  }

}
