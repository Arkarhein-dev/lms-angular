package com.startinpoint.lms.service;

import java.time.LocalDate;

import com.startinpoint.lms.dto.request.BookCreateOrUpdateRequestDto;
import com.startinpoint.lms.dto.response.BookResponseDto;
import com.startinpoint.lms.dto.response.BorrowRecordResponseDto;
import com.startinpoint.lms.mapper.BookMapper;
import com.startinpoint.lms.mapper.BorrowRecordMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.startinpoint.lms.entity.Book;
import com.startinpoint.lms.entity.BorrowRecord;
import com.startinpoint.lms.entity.BorrowStatus;
import com.startinpoint.lms.entity.User;
import com.startinpoint.lms.repository.BookRepository;
import com.startinpoint.lms.repository.BorrowRecordRepository;
import com.startinpoint.lms.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookService {

	private final BookRepository bookRepository;
	private final UserRepository userRepository;
	private final BorrowRecordRepository borrowRecordRepository;
	private final EmailService emailService;
	private final BookMapper bookMapper;
  private final BorrowRecordMapper borrowRecordMapper;

	public Page<BookResponseDto> getAllBooks(Pageable pageable) {
		return bookRepository.findAll(pageable).map(bookMapper::toBookResponse);
	}

	public Page<BookResponseDto> getAllBooksWithKeyword(int page, String keyword, int size, String sortField, String sortDir) {
		int pageIndex = (page < 1) ? 0 : page - 1;
		Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
				? Sort.by(sortField).ascending()
				: Sort.by(sortField).descending();

		Pageable pageable = PageRequest.of(pageIndex, size, sort);
		return bookRepository.searchBookWithKeyword(keyword, pageable).map(bookMapper::toBookResponse);
	}

	// Search Books with By keyword
	public Page<BookResponseDto> searchBook(String keyword,int pageNo, int pageSize, String sortField, String sortDir ){
		int pageIndex = (pageNo < 1) ? 0 : pageNo - 1;
		Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
				? Sort.by(sortField).ascending()
				: Sort.by(sortField).descending();

		Pageable pageable = PageRequest.of(pageIndex,pageSize,sort);
		return bookRepository.searchBookWithKeyword(keyword, pageable).map(bookMapper::toBookResponse);
	}

	public BookResponseDto getBookById(long id) {
		Book book = bookRepository.findById(id).orElseThrow(() ->new IllegalArgumentException("Book Not Found."));
		return bookMapper.toBookResponse(book);
	}

  // Available Books ONLY (No keyword)
  public Page<BookResponseDto> getAvailableBooks(int pageNo, int pageSize, String sortField, String sortDir) {
    int pageIndex = (pageNo < 1) ? 0 : pageNo - 1;
    Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
      ? Sort.by(sortField).ascending()
      : Sort.by(sortField).descending();

    Pageable pageable = PageRequest.of(pageIndex, pageSize, sort);
    return bookRepository.findByStockGreaterThan(0, pageable).map(bookMapper::toBookResponse);
  }

  // Available Books ONLY + Keyword Search
  public Page<BookResponseDto> getAvailableBooksWithKeyword(String keyword, int pageNo, int pageSize, String sortField, String sortDir) {
    int pageIndex = (pageNo < 1) ? 0 : pageNo - 1;
    Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
      ? Sort.by(sortField).ascending()
      : Sort.by(sortField).descending();

    Pageable pageable = PageRequest.of(pageIndex, pageSize, sort);
    return bookRepository.searchAvailableBooksWithKeyword(keyword, pageable).map(bookMapper::toBookResponse);
  }


  @Transactional
public BookResponseDto saveOrUpdateBook(Long id, BookCreateOrUpdateRequestDto dto) {
  if (id != null && id > 0) {
    return bookRepository.findById(id)
      .map(existingBook -> {
        bookMapper.updateBookFromDto(dto, existingBook);
        Book updatedBook = bookRepository.save(existingBook);
        return bookMapper.toBookResponse(updatedBook);
      })
      .orElseGet(() -> createNewBook(dto));
  }

  return createNewBook(dto);
}

  private BookResponseDto createNewBook(BookCreateOrUpdateRequestDto dto) {
//    if(bookRepository.existsByBookTitle()){
//      implement later check for same book title
//    }
//
    Book newBook = bookMapper.toBookEntity(dto);
    Book savedBook = bookRepository.save(newBook);
    return bookMapper.toBookResponse(savedBook);
  }

	public void deleteBook(Long id) {
		bookRepository.deleteById(id);
	}

	@Transactional
	public BorrowRecordResponseDto borrowBook(Long bookId, String username, int borrowDays) {
		Book book = bookRepository.findById(bookId).orElseThrow(() -> new IllegalArgumentException("Book Not found..."));
		if(borrowDays < 1 || borrowDays >14){
			throw new IllegalArgumentException("Borrow Durations Must be Between 1 and 14 days");
		}

		if(!book.isAvailable() || book.getStock() <=0) {
			emailService.sendOutOfStockNotificationToAdmin(book.getTitle(),book.getId(),username);
			throw new IllegalArgumentException("Sry, this book is out of stock.");
		}

		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new IllegalArgumentException("User Not Found with name "+username));

		boolean isBorrowed = borrowRecordRepository.existsByBookIdAndUserUsernameAndStatus(bookId, username, BorrowStatus.BORROWED);

		if(isBorrowed) {
			throw new IllegalArgumentException("Book is already borrowed...");
		}

		BorrowRecord borrowRecord = new BorrowRecord();
		borrowRecord.setBook(book);
		borrowRecord.setUser(user);
		borrowRecord.setBorrowDate(LocalDate.now());
		borrowRecord.setDueDate(LocalDate.now().plusDays(borrowDays));
		borrowRecord.setStatus(BorrowStatus.BORROWED);
	  BorrowRecord savedBorrowRecord =	borrowRecordRepository.save(borrowRecord);

		book.setStock(book.getStock()-1);
		if(book.getStock()<=0) {
			book.setAvailable(false);
		}
		bookRepository.save(book);
    return borrowRecordMapper.toResponseDto(savedBorrowRecord);
	}

	@Transactional
	public BorrowRecordResponseDto returnBook(Long recordId) {
		BorrowRecord record = borrowRecordRepository.findById(recordId)
				.orElseThrow(() -> new IllegalArgumentException("Record Not Found with id "+recordId));

		if(record.getStatus()==BorrowStatus.RETURNED) {
			throw new IllegalArgumentException("Book is already Returned...");
		}

		record.setReturnedDate(LocalDate.now());
		record.setStatus(BorrowStatus.RETURNED);
		BorrowRecord savedBorrowRecord = borrowRecordRepository.save(record);

		Book book = record.getBook();
		book.setStock(book.getStock()+1);
		book.setAvailable(true);
		bookRepository.save(book);
    return borrowRecordMapper.toResponseDto(savedBorrowRecord);
	}


}
