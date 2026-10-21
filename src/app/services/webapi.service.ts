import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs';
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
    title?: string;
    category?: string;
    path?: string;
    level?: string;
    tags?: string;
    incrementView?: boolean;
    viewCount?: number;
    views?: number;
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
    title?: string;
    category?: string;
    path?: string;
    level?: string;
    tags?: string;
    incrementView?: boolean;
    viewCount?: number;
    views?: number;
  }) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/content/upload`;
    return this.Http.post<any>(url, body, { headers });
  }

  public IncrementContentView(id: number) {
    return this.UploadContent({ id: Number(id), incrementView: true });
  }

  public GetAllContent(filters: any = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/content/all`;
    return this.Http.post<any>(url, filters, { headers });
  }

  public ContentStatus(id: number, isActive?: boolean) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/content/status?contentId=${id}`;
    const payload: any = {
      contentId: id,
      id: id
    };
    if (isActive !== undefined) {
      payload.isActive = isActive;
      payload.status = isActive ? 'ACTIVE' : 'DISABLED';
      payload.action = isActive ? 'ENABLE' : 'DISABLE';
    }
    return this.Http.post<any>(url, payload, { headers });
  }

  public ToggleContentStatus(id: number, isActive?: boolean) {
    return this.ContentStatus(id, isActive);
  }

  public SendOtp(email: string, resendOtp: boolean = false) {
    const url = `${this.WebApi}/api/v1/admin/auth/send-otp`;
    return this.Http.post<any>(url, { email, resendOtp }).pipe(
      timeout(10000)
    );
  }

  public VerifyOtp(email: string, otp: string) {
    const url = `${this.WebApi}/api/v1/admin/auth/verify-otp`;
    return this.Http.post<any>(url, { email, otp }).pipe(
      timeout(10000)
    );
  }

  public ResetPassword(body: { email: string; newPassword: string; confirmPassword: string }) {
    const url = `${this.WebApi}/api/v1/admin/auth/reset-password`;
    return this.Http.post<any>(url, body).pipe(
      timeout(10000)
    );
  }

  public Logout(token: string) {
    const url = `${this.WebApi}/api/v1/auth/logout`;
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ${token}`
    });
    return this.Http.post<any>(url, token, { headers });
  }

  // ==========================================
  // Health Awareness API Methods
  // ==========================================
  public GetHealthAwareness(filters: any = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/health-content/list`;
    return this.Http.post<any>(url, filters, { headers });
  }

  public CreateHealthAwareness(body: {
    title: string;
    category: string;
    description: string;
    id?: number | string;
  }) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/health-content/create`;
    const payload: any = {
      title: body.title,
      category: body.category,
      description: body.description
    };
    if (body.id !== undefined && body.id !== null && body.id !== '') {
      payload.id = body.id;
    }
    return this.Http.post<any>(url, payload, { headers });
  }

  public SaveHealthAwareness(body: any) {
    return this.CreateHealthAwareness(body);
  }

  public ToggleHealthAwarenessStatus(id: number | string, isActive: boolean) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/health-content/toggle-status`;
    const payload = {
      id: Number(id),
      isActive: Boolean(isActive)
    };
    return this.Http.post<any>(url, payload, { headers });
  }

  public DeleteHealthAwareness(id: number | string) {
    return this.ToggleHealthAwarenessStatus(Number(id), false);
  }

  public GetHealthCategories(body: any = {}) {
    return this.GetMedicalCategories(body);
  }

  public GetMedicalCategories(body: any = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/masterdata/categories`;
    return this.Http.post<any>(url, body, { headers });
  }

  public GetCategories(body: any = {}) {
    return this.GetMedicalCategories(body);
  }

  // ==========================================
  // Healthcare Champions API Methods
  // ==========================================
  public GetHealthcareChampions(filters: any = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/healthcare-champions/list`;
    return this.Http.post<any>(url, filters, { headers });
  }

  public CreateHealthcareChampion(body: any) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/healthcare-champions/create`;
    return this.Http.post<any>(url, body, { headers });
  }

  public SaveHealthcareChampion(body: any) {
    return this.CreateHealthcareChampion(body);
  }

  public ToggleHealthcareChampionStatus(id: number | string, isActive: boolean) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/healthcare-champions/toggle-status`;
    const payload = {
      id: Number(id),
      isActive: Boolean(isActive)
    };
    return this.Http.post<any>(url, payload, { headers });
  }

  public DeleteHealthcareChampion(id: number | string) {
    return this.ToggleHealthcareChampionStatus(Number(id), false);
  }

  // ==========================================
  // Home Remedies API Methods
  // ==========================================
  public GetHomeRemedies(filters: any = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/home-remedies/list`;
    return this.Http.post<any>(url, filters, { headers });
  }

  public CreateHomeRemedy(body: any) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/home-remedies/create`;
    return this.Http.post<any>(url, body, { headers });
  }

  public UpdateHomeRemedy(body: any) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/home-remedies/create`;
    return this.Http.post<any>(url, body, { headers });
  }

  public SaveHomeRemedy(body: any) {
    return this.CreateHomeRemedy(body);
  }

  public ToggleHomeRemedyStatus(id: number | string, isActive: boolean) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/home-remedies/toggle-status`;
    const payload = {
      id: Number(id),
      isActive: Boolean(isActive)
    };
    return this.Http.post<any>(url, payload, { headers });
  }

  public DeleteHomeRemedy(id: number | string) {
    return this.ToggleHomeRemedyStatus(Number(id), false);
  }

  public GetHomeRemedyCategories(body: any = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/masterdata/home-remedy-categories`;
    return this.Http.post<any>(url, body, { headers });
  }

  // ==========================================
  // Support Groups API Methods
  // ==========================================
  public GetSupportGroups(filters: any = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/support-groups/list`;
    return this.Http.post<any>(url, filters, { headers });
  }

  public CreateSupportGroup(body: any) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/support-groups/save`;
    return this.Http.post<any>(url, body, { headers });
  }

  public UpdateSupportGroup(body: any) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/support-groups/save`;
    return this.Http.post<any>(url, body, { headers });
  }

  public SaveSupportGroup(body: any) {
    return this.CreateSupportGroup(body);
  }

  public ToggleSupportGroupStatus(id: number | string, isActive: boolean) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/admin/api/support-groups/toggle-status`;
    const payload = {
      id: Number(id),
      isActive: Boolean(isActive)
    };
    return this.Http.post<any>(url, payload, { headers });
  }

  public DeleteSupportGroup(id: number | string) {
    return this.ToggleSupportGroupStatus(Number(id), false);
  }

  public JoinSupportGroupMember(groupId: string, memberData: any) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.WebApi}/api/v1/support-groups/join`;
    return this.Http.post<any>(url, { groupId, ...memberData }, { headers });
  }
}

