package com.startinpoint.lms.controller;

import com.startinpoint.lms.dto.SchedulerConfigDto;
import com.startinpoint.lms.dto.StockOutAlertConfigDto;
import com.startinpoint.lms.dto.request.AdminSettingRequestDto;
import com.startinpoint.lms.dto.response.AdminSettingResponseDto;
import com.startinpoint.lms.service.AdminSettingService;
import com.startinpoint.lms.service.OverDueJobQuartzSchedulerService;
import com.startinpoint.lms.service.StockOutEmailTriggerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.quartz.SchedulerException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

  private final OverDueJobQuartzSchedulerService overDueJobQuartzSchedulerService;
  private final StockOutEmailTriggerService stockOutEmailTriggerService;
  private final AdminSettingService adminSettingService;

  // --- Overdue Scheduler Endpoints ---

  // localhost:8081/library/api/v1/admin/settings/borrow-overdue-scheduler
  // get borrow overdue scheduler config
  @GetMapping("/borrow-overdue-scheduler")
  public ResponseEntity<SchedulerConfigDto> getBorrowOverdueSchedulerConfig() {
    SchedulerConfigDto config = overDueJobQuartzSchedulerService.getOverdueJobConfig();
    return ResponseEntity.ok(config);
  }

  // update borrow overdue scheduler
  @PutMapping("/borrow-overdue-scheduler")
  public ResponseEntity<Map<String, String>> saveBorrowOverdueScheduler(
    @RequestParam(value = "enabled", defaultValue = "false") boolean enabled,
    @RequestParam("time") String time // Accepts "HH:mm"
  ) {
    try {
      // Safe parsing to avoid ArrayIndexOutOfBoundsException on malformed strings
      LocalTime parsedTime = LocalTime.parse(time);
      String hour = String.format("%02d", parsedTime.getHour());
      String minute = String.format("%02d", parsedTime.getMinute());

      // Format into Quartz cron: "0 mm HH * * ?"
      String cronExpression = String.format("0 %s %s * * ?", minute, hour);

      overDueJobQuartzSchedulerService.updateOverdueScheduler(enabled, cronExpression);
      return ResponseEntity.ok(Map.of(
        "message", "Quartz overdue configuration updated successfully to " + time + "!"
      ));
    } catch (DateTimeParseException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
        "error", "Invalid time format. Please use 'HH:mm' format."
      ));
    } catch (SchedulerException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
        "error", "Failed to update Quartz schedule: " + e.getMessage()
      ));
    }
  }

  // Trigger overdue check job immediately
  @PostMapping("/borrow-overdue-scheduler/trigger")
  public ResponseEntity<Map<String, String>> triggerOverdueCheckNow() {
    try {
      overDueJobQuartzSchedulerService.triggerJobNow();
      return ResponseEntity.ok(Map.of("message", "Quartz overdue alert job triggered immediately!"));
    } catch (SchedulerException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
        "error", "Failed to trigger Quartz job now: " + e.getMessage()
      ));
    }
  }


  // --- Admin Email Alert Endpoints ---

  // Get Stock out alert config for admin
  @GetMapping("/stock-out-alert")
  public ResponseEntity<StockOutAlertConfigDto> getStockOutAlertConfig() {
    StockOutAlertConfigDto config = stockOutEmailTriggerService.getCurrentConfig();
    return ResponseEntity.ok(config);
  }

  // Update Stock out schedule of admin
  @PutMapping("/stock-out-alert")
  public ResponseEntity<Map<String, String>> updateStockOutSchedule(
    @RequestBody StockOutAlertConfigDto config
  ) {
    try {
      stockOutEmailTriggerService.updateStockOutSchedule(config);
      return ResponseEntity.ok(Map.of("message", "Stock Out email schedule updated successfully."));
    } catch (SchedulerException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
        "error", "Failed to update stock out email schedule: " + e.getMessage()
      ));
    }
  }

  // Toggle Stock out Alert trigger status
  @PatchMapping("/stock-out-alert/status")
  public ResponseEntity<Map<String, String>> toggleStockOutAlert(
    @RequestParam(value = "enabled", defaultValue = "false") Boolean enabled
  ) {
    try {
      stockOutEmailTriggerService.toggleAlertTrigger(enabled);
      String status = enabled ? "activated" : "paused";
      return ResponseEntity.ok(Map.of("message", "Stock out alert trigger " + status + " successfully."));
    } catch (SchedulerException | IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
        "error", "Error while toggling stock out alert: " + e.getMessage()
      ));
    }
  }


//  ********************************************************************************
//  =================== General Settings like SMB Server Configuratioin ============
//  ********************************************************************************

  // localhost:8081/library/api/v1/admin/settings/admin-general-settings
  @GetMapping("/admin-general-settings")
  public ResponseEntity<Page<AdminSettingResponseDto>> getAllAdminSettings(
    @PageableDefault(page = 0, size = 50, sort = "id", direction = Sort.Direction.ASC)Pageable pageable
    ){
    return ResponseEntity.status(HttpStatus.OK).body(adminSettingService.getAllAdminSettings(pageable));
  }

  @PostMapping("/admin-general-settings")
  public ResponseEntity<AdminSettingResponseDto> createAdminSetting(@Valid @RequestBody AdminSettingRequestDto requestDto){
    return ResponseEntity.ok(adminSettingService.createSetting(requestDto));
  }

  // localhost:8081/library/api/v1/admin/settings/admin-general-settings/{id}
  @PutMapping("/admin-general-settings/{id}")
  public ResponseEntity<AdminSettingResponseDto> updateAdminSetting(
    @PathVariable Long id, @Valid @RequestBody AdminSettingRequestDto requestDto
  ){
   return ResponseEntity.ok(adminSettingService.updateSetting(id, requestDto));
  }

  @DeleteMapping("/admin-general-settings/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteSetting(@PathVariable Long id){
    adminSettingService.deleteSetting(id);
  }

}
