package com.startinpoint.lms.service;

import com.startinpoint.lms.dto.response.BorrowRecordResponseDto;
import com.startinpoint.lms.entity.BorrowStatus;
import com.startinpoint.lms.mapper.BorrowRecordMapper;
import com.startinpoint.lms.mapper.UserMapper;
import com.startinpoint.lms.repository.BorrowRecordRepository;
import com.startinpoint.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BorrowRecordService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;
    private final BorrowRecordMapper borrowRecordMapper;
    private final UserMapper userMapper;




    public Page<BorrowRecordResponseDto> getUserActiveBorrowRecords(
            String username, BorrowStatus status,
            Pageable pageable
    ) {

        if (status == null) {
            return borrowRecordRepository.findByUserUsername(username, pageable)
                    .map(borrowRecordMapper::toResponseDto);
        }
        return borrowRecordRepository.findByUserUsernameAndStatus(username, status, pageable)
                .map(borrowRecordMapper::toResponseDto);
    }

    public Page<BorrowRecordResponseDto> fetchBorrowRecordByKeyword(
            String keyword, String username, BorrowStatus status,
            Pageable pageable
    ) {
        if (status == null) {
            return borrowRecordRepository.findBorrowBookBykeyword(username, keyword, pageable)
                    .map(borrowRecordMapper::toResponseDto);
        }
        return borrowRecordRepository.findBorrowRecordByKeywordAndStatus(username, keyword, status, pageable)
                .map(borrowRecordMapper::toResponseDto);
    }


    // Fetch borrow Record by User
    public Page<BorrowRecordResponseDto> fetchBorrowRecordByUser(
            Long userId, BorrowStatus status,
            Pageable pageable
    ) {
        if (status != null) {
            return borrowRecordRepository.findByUserIdAndStatus(userId, status, pageable)
                    .map(borrowRecordMapper::toResponseDto);
        }
        return borrowRecordRepository.findByUserId(userId, pageable)
                .map(borrowRecordMapper::toResponseDto);
    }

    // Fetch borrow Record by User ID + Keyword
    public Page<BorrowRecordResponseDto> fetchBorrowRecordByUserWithKeyword(
            Long userId, String keyword, BorrowStatus status, Pageable pageable
    ) {

        if (status == null) {
            return borrowRecordRepository.fetchBorrowRecordByUserWithKeyword(userId, keyword, pageable)
                    .map(borrowRecordMapper::toResponseDto);
        }
        return borrowRecordRepository.fetchBorrowRecordByUserWithKeywordAndStatus(userId, keyword, status, pageable)
                .map(borrowRecordMapper::toResponseDto);
    }


  public Page<BorrowRecordResponseDto> getAllBorrowRecords(Pageable pageable) {
      return borrowRecordRepository.findAll(pageable).map(borrowRecordMapper::toResponseDto);
  }
}
