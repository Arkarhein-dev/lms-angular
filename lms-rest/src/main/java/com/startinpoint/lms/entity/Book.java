package com.startinpoint.lms.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(length = 150, nullable = false)
	private String title;

	@Column(length = 150, nullable = false)
	private String author;

	@Column(nullable = false)
	private String imageUrl;

	@Column(length = 150, nullable = false)
	private String genre;

  @Lob
	@Column(nullable = false,length = 100000)
	private String description;

	@Column(nullable = false)
	private int stock;

	@Column(nullable = false)
	private boolean available;

  private String filepath;

	@OneToMany(mappedBy = "book")
	private List<BorrowRecord> borrowRecords;
}
