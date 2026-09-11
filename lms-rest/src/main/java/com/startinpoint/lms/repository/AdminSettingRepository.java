package com.startinpoint.lms.repository;

import com.startinpoint.lms.entity.AdminSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminSettingRepository extends JpaRepository<AdminSetting, Long> {

  List<AdminSetting> findByCategoryName(String categoryName);

  boolean existsByLabel(String label);
}
