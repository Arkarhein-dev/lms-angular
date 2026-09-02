package com.startinpoint.lms.controller;

import com.startinpoint.lms.dto.response.BookResponseDto;
import com.startinpoint.lms.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/books")
@CrossOrigin("http://localhost:4200")
public class BookController {
    private final BookService bookService;

    // localhost:8081/library/api/v1/books
    @GetMapping
    public ResponseEntity<Page<BookResponseDto>> getAllBooks(
            @PageableDefault(page=0, size=6, sort = "id", direction = Sort.Direction.ASC)Pageable pageable
            ){
        return ResponseEntity.ok(bookService.getAllBooks(pageable));
    }
}
