package com.startinpoint.lms.controller;

import com.startinpoint.lms.dto.SchedulerConfigDto;
import com.startinpoint.lms.dto.StockOutAlertConfigDto;
import com.startinpoint.lms.service.QuartzSchedulerService;
import com.startinpoint.lms.service.StockOutEmailTriggerService;
import lombok.RequiredArgsConstructor;
import org.quartz.SchedulerException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
public class AdminController {

  private final QuartzSchedulerService quartzSchedulerService;
  private final StockOutEmailTriggerService stockOutEmailTriggerService;

  // --- Overdue Scheduler Endpoints ---

  @GetMapping("/borrow-overdue-scheduler")
  public ResponseEntity<SchedulerConfigDto> getBorrowOverdueSchedulerConfig() {
    SchedulerConfigDto config = quartzSchedulerService.getOverdueJobConfig();
    return ResponseEntity.ok(config);
  }

  @PostMapping("/save-borrow-overdue-scheduler")
  public ResponseEntity<Map<String, String>> saveBorrowOverdueScheduler(
    @RequestParam(value = "enabled", defaultValue = "false") boolean enabled,
    @RequestParam("time") String time // Accepts "HH:mm"
  ) {
    try {
      String[] timeParts = time.split(":");
      String hour = timeParts[0];
      String minute = timeParts[1];

      // Format into Quartz cron: "0 mm HH * * ?"
      String cronExpression = String.format("0 %s %s * * ?", minute, hour);

      quartzSchedulerService.updateOverdueScheduler(enabled, cronExpression);
      return ResponseEntity.ok(Map.of(
        "message", "Quartz overdue configuration updated successfully to " + time + "!"
      ));
    } catch (SchedulerException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
        "error", "Failed to update Quartz schedule: " + e.getMessage()
      ));
    }
  }

  @PostMapping("/trigger-overdue-check")
  public ResponseEntity<Map<String, String>> triggerOverdueCheckNow() {
    try {
      quartzSchedulerService.triggerJobNow();
      return ResponseEntity.ok(Map.of("message", "Quartz overdue alert job triggered immediately!"));
    } catch (SchedulerException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
        "error", "Failed to trigger Quartz job now: " + e.getMessage()
      ));
    }
  }

  // --- Admin Email Alert Endpoints ---

  @GetMapping("/stock-out-alert")
  public ResponseEntity<StockOutAlertConfigDto> getStockOutAlertConfig() {
    StockOutAlertConfigDto config = stockOutEmailTriggerService.getCurrentConfig();
    return ResponseEntity.ok(config);
  }

  @PostMapping("/stock-out-schedule")
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

  @PostMapping("/toggle-stock-out-alert")
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
}
