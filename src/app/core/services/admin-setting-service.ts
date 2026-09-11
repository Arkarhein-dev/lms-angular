import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../shared/models/page.model';
import {
  SystemSettingRequest,
  SystemSettingResponse,
} from '../../features/admin/model/system-setting.model';

export interface SchedulerConfigDto {
  enabled: boolean;
  cronExpression: string;
}

export interface StockOutAlertConfigDto {
  adminEmail: string;
  intervalValue: number;
  timeUnit: string;
  enabled: boolean;
}

@Service()
export class AdminSettingService {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:8081/library/api/v1/admin/settings';

  // --- Overdue Scheduler APIs ---

  // get borrow overdue scheduler config
  getOverdueSchedulerConfig(): Observable<SchedulerConfigDto> {
    return this.httpClient.get<SchedulerConfigDto>(`${this.baseUrl}/borrow-overdue-scheduler`);
  }

  // update borrow overdue scheduler
  saveOverdueScheduler(enabled: boolean, time: string): Observable<{ message: string }> {
    const params = new HttpParams().set('enabled', enabled).set('time', time);
    return this.httpClient.put<{ message: string }>(
      `${this.baseUrl}/borrow-overdue-scheduler`,
      null,
      { params },
    );
  }

  // Trigger overdue check job immediately
  triggerOverdueCheckNow(): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(
      `${this.baseUrl}/borrow-overdue-scheduler/trigger`,
      {},
    );
  }

  // --- Stock Out Alert APIs ---

  // Get Stock out alert config for admin
  getStockOutAlertConfig(): Observable<StockOutAlertConfigDto> {
    return this.httpClient.get<StockOutAlertConfigDto>(`${this.baseUrl}/stock-out-alert`);
  }

  // Update Stock out schedule of admin
  updateStockOutSchedule(config: StockOutAlertConfigDto): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${this.baseUrl}/stock-out-alert`, config);
  }

  // Toggle Stock out Alert trigger status
  toggleStockOutAlert(enabled: boolean): Observable<{ message: string }> {
    const params = new HttpParams().set('enabled', enabled);
    return this.httpClient.patch<{ message: string }>(
      `${this.baseUrl}/stock-out-alert/status`,
      null,
      { params },
    );
  }

  //  *******************************************************************
  //  ================= Admin System Settings ==========================
  // ********************************************************************

  getAllSystemSettings(
    page: number = 0,
    size: number = 10,
    sortField: string = 'id',
    sortDir: 'asc' | 'desc' = 'asc',
  ): Observable<Page<SystemSettingResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sortField},${sortDir}`);
    return this.httpClient.get<Page<SystemSettingResponse>>(
      `${this.baseUrl}/admin-general-settings`,
      { params },
    );
  }

  createAdminSetting(request: SystemSettingRequest): Observable<SystemSettingResponse> {
    return this.httpClient.post<SystemSettingResponse>(
      `${this.baseUrl}/admin-general-settings`,
      request,
    );
  }

  updateAdminSetting(id: number, request: SystemSettingRequest): Observable<SystemSettingResponse> {
    return this.httpClient.put<SystemSettingResponse>(
      `${this.baseUrl}/admin-general-settings/${id}`,
      request,
    );
  }

  deleteAdminSetting(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/admin-general-settings/${id}`);
  }
}
