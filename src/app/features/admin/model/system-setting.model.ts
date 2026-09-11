export interface SystemSettingResponse {
  id: number;
  categoryName: string;
  label: string;
  value: string;
  createdAt: string;
  createdBy: string;
}

export interface SystemSettingRequest {
  categoryName: string;
  label: string;
  value: string;
}
