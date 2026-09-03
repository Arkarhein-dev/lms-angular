package com.startinpoint.lms.controller;

import com.startinpoint.lms.dto.request.BookCreateOrUpdateRequestDto;
import com.startinpoint.lms.dto.response.BookResponseDto;
import com.startinpoint.lms.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
            @PageableDefault(page=0, size=100, sort = "id", direction = Sort.Direction.ASC)Pageable pageable
            ){
        return ResponseEntity.ok(bookService.getAllBooks(pageable));
    }

    // 1. CREATE ENDPOINT
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookResponseDto> createBook(@Valid @RequestBody BookCreateOrUpdateRequestDto dto) {
      BookResponseDto createdBook = bookService.saveOrUpdateBook(null, dto);
      return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
    }

    // 2. UPDATE ENDPOINT
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookResponseDto> updateBook( @PathVariable Long id, @Valid @RequestBody BookCreateOrUpdateRequestDto dto
    ) {
      BookResponseDto updatedBook = bookService.saveOrUpdateBook(id, dto);
      return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBook(@PathVariable Long id){
      bookService.deleteBook(id);
    }

}
