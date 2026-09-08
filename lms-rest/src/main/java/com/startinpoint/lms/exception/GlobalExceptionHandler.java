package com.startinpoint.lms.exception;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleResourceAlreadyExists(ResourceAlreadyExistsException ex){
    ErrorResponse err = ErrorResponse.builder()
      .status(HttpStatus.CONFLICT.value())
      .message(ex.getMessage())
      .timestamp(LocalDateTime.now())
      .build();
    return new ResponseEntity<>(err, HttpStatus.CONFLICT);
  }

  // Handle resource not found (404)
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex){
    ErrorResponse err = ErrorResponse.builder()
      .status(HttpStatus.NOT_FOUND.value())
      .message(ex.getMessage())
      .timestamp(LocalDateTime.now())
      .build();

    return new ResponseEntity<>(err, HttpStatus.NOT_FOUND);
  }

  // Handle custom bad request
  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex){
    ErrorResponse err = ErrorResponse.builder()
      .status(HttpStatus.BAD_REQUEST.value())
      .message(ex.getMessage())
      .timestamp(LocalDateTime.now())
      .build();

    return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
  }

  // Handle Validation error for @Valid bad request (400)
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex){
    Map<String, String> errors = new HashMap<>();
    for(FieldError err : ex.getBindingResult().getFieldErrors()){
      errors.put(err.getField(), err.getDefaultMessage());
    }
    ErrorResponse err = ErrorResponse.builder()
      .status(HttpStatus.BAD_REQUEST.value())
      .message("Validation failed for request parameter")
      .timestamp(LocalDateTime.now())
      .validationErrors(errors)
      .build();

    return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
  }

// Handle Spring Security Access Denied (403)
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex){
    ErrorResponse err = ErrorResponse.builder()
      .status(HttpStatus.FORBIDDEN.value())
      .message("Access Denied: You do not have permission to access this resource.")
      .timestamp(LocalDateTime.now())
      .build();

    return new ResponseEntity<>(err, HttpStatus.FORBIDDEN);
  }

//  Handle Spring Security Bad Credentials (401)
  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex){
    ErrorResponse err = ErrorResponse.builder()
      .status(HttpStatus.UNAUTHORIZED.value())
      .message("Invalid Credentials")
      .timestamp(LocalDateTime.now())
      .build();

    return new ResponseEntity<>(err, HttpStatus.UNAUTHORIZED);
  }

  // Fallback Handler for unexpected internal server errors (500)
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex){
    ErrorResponse err = ErrorResponse.builder()
      .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
      .message("An unexpected error occurred : "+ ex.getMessage())
      .timestamp(LocalDateTime.now())
      .build();
    return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

}
