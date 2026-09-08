import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AdminSettingService,
  SchedulerConfigDto,
  StockOutAlertConfigDto,
} from '../../../core/services/admin-setting-service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzTimePickerModule,
    NzSelectModule,
    NzCheckboxModule,
    NzSwitchModule,
    NzButtonModule,
    NzTagModule,
    NzGridModule,
    NzDividerModule,
    NzSpaceModule,
  ],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css',
})
export class AdminSettings implements OnInit {
  private settingsService = inject(AdminSettingService);
  private fb = inject(FormBuilder);

  overdueForm!: FormGroup;
  stockOutForm!: FormGroup;

  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.initForms();
    this.loadSettings();
  }

  private initForms(): void {
    this.overdueForm = this.fb.group({
      enabled: [false],
      time: [null, Validators.required], // Set initial time to null for Date object
    });

    this.stockOutForm = this.fb.group({
      adminEmail: ['', [Validators.required, Validators.email]],
      intervalValue: [1, [Validators.required, Validators.min(1)]],
      timeUnit: ['HOURS', Validators.required],
      enabled: [false],
    });
  }

  loadSettings(): void {
    this.isLoading = true;

    // Load Overdue Job Settings
    this.settingsService.getOverdueSchedulerConfig().subscribe({
      next: (config: SchedulerConfigDto) => {
        const timeDate = this.parseCronToDate(config.cronExpression);
        this.overdueForm.patchValue({
          enabled: config.enabled,
          time: timeDate,
        });
      },
      error: () => this.showError('Failed to load overdue settings'),
    });

    // Load Stock Out Alert Settings
    this.settingsService.getStockOutAlertConfig().subscribe({
      next: (config: StockOutAlertConfigDto) => {
        this.stockOutForm.patchValue(config);
        this.isLoading = false;
      },
      error: () => {
        this.showError('Failed to load stock out alert settings');
        this.isLoading = false;
      },
    });
  }

  onSaveOverdueScheduler(): void {
    if (this.overdueForm.invalid) return;
    const { enabled, time } = this.overdueForm.value;

    // Format Date object back to "HH:mm" string for the service
    const formattedTime = this.formatDateToHHmm(time);

    this.settingsService.saveOverdueScheduler(enabled, formattedTime).subscribe({
      next: (res) => this.showSuccess(res.message),
      error: (err) => this.showError(err.error?.error || 'Failed to update overdue schedule'),
    });
  }

  onTriggerOverdueNow(): void {
    this.settingsService.triggerOverdueCheckNow().subscribe({
      next: (res) => this.showSuccess(res.message),
      error: (err) => this.showError(err.error?.error || 'Failed to trigger overdue check'),
    });
  }

  onSaveStockOutSchedule(): void {
    if (this.stockOutForm.invalid) return;

    this.settingsService.updateStockOutSchedule(this.stockOutForm.value).subscribe({
      next: (res) => this.showSuccess(res.message),
      error: (err) => this.showError(err.error?.error || 'Failed to update stock out schedule'),
    });
  }

  // Accepts boolean direct value emitted by nz-switch
  onToggleStockOutAlert(isChecked: boolean): void {
    this.settingsService.toggleStockOutAlert(isChecked).subscribe({
      next: (res) => {
        this.stockOutForm.patchValue({ enabled: isChecked });
        this.showSuccess(res.message);
      },
      error: (err) => {
        // Revert toggle state on error
        this.stockOutForm.patchValue({ enabled: !isChecked });
        this.showError(err.error?.error || 'Failed to toggle status');
      },
    });
  }

  // Converts cron to JS Date object for nz-time-picker
  private parseCronToDate(cron: string): Date {
    const defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);

    if (!cron) return defaultDate;

    const parts = cron.split(' ');
    if (parts.length >= 3) {
      const minute = parseInt(parts[1], 10) || 0;
      const hour = parseInt(parts[2], 10) || 0;

      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      return date;
    }
    return defaultDate;
  }

  // Helper to format Date object into "HH:mm"
  private formatDateToHHmm(date: Date): string {
    if (!date) return '00:00';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.errorMessage = null;
    setTimeout(() => (this.successMessage = null), 4000);
  }

  private showError(msg: string): void {
    this.errorMessage = msg;
    this.successMessage = null;
  }
}
