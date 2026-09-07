import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

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
  private readonly baseUrl = 'http://localhost:8081/library/api/v1/admin/settings';

  // Overdue Scheduler APIs
  getOverdueSchedulerConfig(): Observable<SchedulerConfigDto> {
    return this.httpClient.get<SchedulerConfigDto>(`${this.baseUrl}/borrow-overdue-scheduler`);
  }

  saveOverdueScheduler(enabled: boolean, time: string): Observable<{ message: string }> {
    const params = new HttpParams().set('enabled', enabled).set('time', time);
    return this.httpClient.post<{ message: string }>(
      `${this.baseUrl}/save-borrow-overdue-scheduler`,
      null,
      { params },
    );
  }

  triggerOverdueCheckNow(): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${this.baseUrl}/trigger-overdue-check`, {});
  }

  // Stock Out Alert APIs
  getStockOutAlertConfig(): Observable<StockOutAlertConfigDto> {
    return this.httpClient.get<StockOutAlertConfigDto>(`${this.baseUrl}/stock-out-alert`);
  }

  updateStockOutSchedule(config: StockOutAlertConfigDto): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${this.baseUrl}/stock-out-schedule`, config);
  }

  toggleStockOutAlert(enabled: boolean): Observable<{ message: string }> {
    const params = new HttpParams().set('enabled', enabled);
    return this.httpClient.post<{ message: string }>(
      `${this.baseUrl}/toggle-stock-out-alert`,
      null,
      {
        params,
      },
    );
  }
}
