import { Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { AdminSettingService } from '../../../../../core/services/admin-setting-service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { SystemSettingResponse } from '../../../model/system-setting.model';

@Component({
  imports: [
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    ReactiveFormsModule,
  ],
  selector: 'app-system-setting-modal',
  styleUrl: './system-setting-modal.css',
  templateUrl: './system-setting-modal.html',
})
export class SystemSettingModal implements OnInit {
  private modalRef = inject(NzModalRef);
  private adminService = inject(AdminSettingService);
  private fb = inject(NonNullableFormBuilder);

  nzModalData?: { setting: SystemSettingResponse } = inject(NZ_MODAL_DATA, { optional: true });

  isSubmitting = signal(false);
  isEditMode = signal(false);

  modalForm = this.fb.group({
    categoryName: ['', [Validators.required]],
    label: ['', [Validators.required]],
    value: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.nzModalData?.setting) {
      this.isEditMode.set(true);
      this.modalForm.patchValue({
        categoryName: this.nzModalData.setting.categoryName,
        label: this.nzModalData.setting.label,
        value: this.nzModalData.setting.value,
      });
    }
  }

  onDestroy() {
    this.modalRef.destroy();
  }

  save() {
    if (this.modalForm.invalid) {
      Object.values(this.modalForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.isSubmitting.set(true);
    const payload = this.modalForm.getRawValue();

    const request$ = this.isEditMode()
      ? this.adminService.updateAdminSetting(this.nzModalData!.setting.id, payload)
      : this.adminService.createAdminSetting(payload);

    request$.subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.modalRef.close(response);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Failed to create settings', err);
      },
    });
  }
}
