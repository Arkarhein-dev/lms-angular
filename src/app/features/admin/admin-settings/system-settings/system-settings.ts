import { Component, inject, OnInit, signal } from '@angular/core';
import { SearchBox } from '../../../../shared/components/search-box/search-box';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SystemSettingResponse } from '../../model/system-setting.model';
import { AdminSettingService } from '../../../../core/services/admin-setting-service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { map } from 'rxjs';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { SystemSettingModal } from './system-setting-modal/system-setting-modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  imports: [
    SearchBox,
    NzTableModule,
    NzButtonModule,
    NzGridModule,
    NzModalModule,
    NzPopconfirmModule,
  ],
  selector: 'app-system-settings',
  styleUrl: './system-settings.css',
  templateUrl: './system-settings.html',
})
export class SystemSettings implements OnInit {
  private adminSettingService = inject(AdminSettingService);
  private modalService = inject(NzModalService);
  private message = inject(NzMessageService);

  systemSettings = signal<SystemSettingResponse[]>([]);

  ngOnInit(): void {
    this.loadSystemSettings();
  }

  loadSystemSettings() {
    this.adminSettingService
      .getAllSystemSettings()
      .pipe(map((pages) => pages.content))
      .subscribe({
        next: (response) => this.systemSettings.set(response),
      });
  }

  openModal(setting?: SystemSettingResponse): void {
    const modalRef = this.modalService.create({
      nzTitle: setting ? 'Edit System Setting' : 'Add System Setting',
      nzContent: SystemSettingModal,
      nzData: { setting },
      nzFooter: null,
      nzMaskClosable: true, // Allows closing by clicking the background overlay
    });

    modalRef.afterClose.subscribe((result) => {
      if (result) {
        this.loadSystemSettings();
        console.log('Modal closed with data : ', result);
      } else {
        console.log('Modal was cancelled or destroyed.');
      }
    });
  }

  deleteSystemSetting(id: number) {
    this.adminSettingService.deleteAdminSetting(id).subscribe({
      next: () => {
        this.message.success('Setting deleted Successfully');
        this.loadSystemSettings();
      },
      error: (err) => {
        this.message.error('Failed to delete Setting');
        console.error('Error while delete setting.', err);
      },
    });
  }
}
