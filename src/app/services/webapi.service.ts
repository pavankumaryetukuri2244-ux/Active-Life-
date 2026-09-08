import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebapiService {
  private readonly WebApi = environment.serviceUrl;

  constructor(
    public Http: HttpClient
  ) { }

  public LoginAdmin(body: { email: string; password: string }) {
    const url = `${this.WebApi}/api/v1/auth/login`;
    return this.Http.post<any>(url, body);
  }

  public GetDashboardStatistics() {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/admin/dashboard`;
    return this.Http.post<any>(url, {}, { headers });
  }

  public GetAuditLogs() {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/audit-logs`;
    return this.Http.post<any>(url, {}, { headers });
  }

  public GetAuditLogsFiltered(filters: {
    page?: number;
    size?: number;
    search?: string;
    module?: string;
    status?: string;
    adminName?: string;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
    sortDirection?: string;
  }) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/audit-logs`;
    return this.Http.post<any>(url, filters, { headers });
  }

  public GetUsers() {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/users`;
    return this.Http.post<any>(url, {}, { headers });
  }

  public GetUsersFiltered(filters: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortDirection?: string;
  }) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/users`;
    return this.Http.post<any>(url, filters, { headers });
  }

  public UpdateUserStatus(userId: number, action: string) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/users/status`;
    return this.Http.post<any>(url, { userId, action }, { headers });
  }

  public GetPreventiveCare() {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/admin/preventive-care`;
    return this.Http.post<any>(url, {}, { headers });
  }

  public AddPregnancyStage(body: {
    id?: number;
    weekRange: string;
    milestones: string;
    scan: string;
  }) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/admin/preventive-care/pregnancy-stage`;
    return this.Http.post<any>(url, body, { headers });
  }

  public UpdatePregnancyStage(body: {
    id: number;
    weekRange: string;
    milestones: string;
    scan: string;
  }) {
    return this.AddPregnancyStage(body);
  }

  public TogglePregnancyStageStatus(stageId: number) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/admin/preventive-care/pregnancy-stage/status?stageId=${stageId}`;
    return this.Http.post<any>(url, { stageId }, { headers });
  }

  public AddChildVaccine(body: {
    id?: number;
    vaccineName: string;
    description: string;
    numberOfDoses: number;
    recommendedAge: string;
  }) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/admin/preventive-care/child-vaccines`;
    return this.Http.post<any>(url, body, { headers });
  }

  public UpdateChildVaccine(body: {
    id: number;
    vaccineName: string;
    description: string;
    numberOfDoses: number;
    recommendedAge: string;
  }) {
    return this.AddChildVaccine(body);
  }

  public AddPregnancyVaccine(body: {
    id?: number;
    vaccineName: string;
    recommendedTiming: string;
    description: string;
  }) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/admin/preventive-care/add-pregnancy-vaccine`;
    return this.Http.post<any>(url, body, { headers });
  }

  public UpdatePregnancyVaccine(body: {
    id: number;
    vaccineName: string;
    recommendedTiming: string;
    description: string;
  }) {
    return this.AddPregnancyVaccine(body);
  }

  public UploadContent(body: {
    id?: number;
    title: string;
    category: string;
    path: string;
    level: string;
    tags: string;
  }) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/content/upload`;
    return this.Http.post<any>(url, body, { headers });
  }

  public UpdateContent(body: {
    id: number;
    title: string;
    category: string;
    path: string;
    level: string;
    tags: string;
  }) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/content/upload`;
    return this.Http.post<any>(url, body, { headers });
  }

  public GetAllContent(filters: any = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/content/all`;
    return this.Http.post<any>(url, filters, { headers });
  }

  public ContentStatus(id: number) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/content/status?contentId=${id}`;
    return this.Http.post<any>(url, { contentId: id, id }, { headers });
  }

  public ToggleContentStatus(id: number) {
    return this.ContentStatus(id);
  }

  public SendOtp(email: string, resendOtp: boolean = false) {
    const url = `${this.WebApi}/api/v1/admin/auth/send-otp`;
    return this.Http.post<any>(url, { email, resendOtp });
  }

  public VerifyOtp(email: string, otp: string) {
    const url = `${this.WebApi}/api/v1/admin/auth/verify-otp`;
    return this.Http.post<any>(url, { email, otp });
  }

  public ResetPassword(body: { email: string; newPassword: string; confirmPassword: string }) {
    const url = `${this.WebApi}/api/v1/admin/auth/reset-password`;
    return this.Http.post<any>(url, body);
  }

  public Logout(token: string) {
    const url = `${this.WebApi}/api/v1/auth/logout`;
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ${token}`
    });
    return this.Http.post<any>(url, token, { headers });
  }
}
