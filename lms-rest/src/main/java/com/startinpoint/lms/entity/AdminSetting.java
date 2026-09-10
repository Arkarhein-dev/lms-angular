package com.startinpoint.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminSetting {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 50)
  private String categoryName; // e.g., "FILE_SERVER"

  @Column(nullable = false,length = 50, unique = true)
  private String label;  // e.g., "SERVER_NAME", "SHARED_NAME", "USERNAME", "PASSWORD"

  @Column(nullable = false, length = 250)
  private String value;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false, updatable = false)
  private String createdBy;

  @PrePersist
  public void onPrePersist(){
    this.setCreatedAt(LocalDateTime.now());
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if(authentication != null && authentication.isAuthenticated()){
      this.setCreatedBy(authentication.getName());
    }else {
      this.setCreatedBy("ADMIN");
    }
  }
}
