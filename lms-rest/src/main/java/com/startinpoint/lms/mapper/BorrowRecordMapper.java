package com.startinpoint.lms.mapper;

import com.startinpoint.lms.dto.response.BorrowRecordResponseDto;
import com.startinpoint.lms.entity.BorrowRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BorrowRecordMapper {
    @Mapping(target = "bookId",source = "book.id")
    @Mapping(target = "bookTitle",source = "book.title")
    @Mapping(target = "bookAuthor",source = "book.author")
    @Mapping(target = "bookImage",source = "book.imageUrl")
    @Mapping(target="bookDescription",source = "book.description")
    @Mapping(target = "userId",source = "user.id")
    BorrowRecordResponseDto toResponseDto(BorrowRecord borrowRecord);

}
