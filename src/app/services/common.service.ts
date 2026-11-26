import { isPlatformBrowser } from '@angular/common';
import { Router } from "@angular/router";
import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2, signal } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import Swal from "sweetalert2";
import { StorageService } from './storage.service';
import { filter } from 'rxjs/internal/operators/filter';
import { pluck } from 'rxjs/internal/operators/pluck';
import { startWith } from 'rxjs/internal/operators/startWith';
import { ToastrService } from "ngx-toastr";
import { map } from 'rxjs/internal/operators/map';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import moment from "moment";
import { WebapiService } from './webapi.service';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public isSpinnerVisible = signal(false);
  public showMenu: boolean = false;
  public showAuth: boolean = false;
  public isBrowser: boolean;
  private renderer: Renderer2;
  public setlang = 'INR';
  public Token = 'accessToken';
  public isLoggedIn$: Observable<boolean>;
  public refreshLogin$ = new BehaviorSubject<boolean>(false);
  private modalReference: any;
  

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private meta: Meta,
    private title: Title,
    public rendererFactory: RendererFactory2,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private storageService: StorageService,
    public router: Router,
    private toastr: ToastrService,
    public api: WebapiService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(platformId);
    config.backdrop = "static";
    config.keyboard = false;
    this.isLoggedIn$ = this.GetLS$(this.Token, "localStorage").pipe(map(o => (o && o !== 'null') ? true : false))    
  }

  // ==========================================
  // Central API Endpoints (All Admin Portal APIs)
  // ==========================================

  // 1. Authentication
  public LoginAdmin(body: { email: string; password: string }) {
    return this.api.LoginAdmin(body);
  }
  public Logout(token: string) {
    return this.api.Logout(token);
  }
  public SendOtp(email: string, resendOtp: boolean = false) {
    return this.api.SendOtp(email, resendOtp);
  }
  public SendDoctorOtp(body: {
    countryCode?: string;
    mobileNumber: string;
    purpose?: string;
    role?: string;
    resendOtp?: boolean;
  }) {
    return this.api.SendDoctorOtp(body);
  }
  public VerifyOtp(email: string, otp: string) {
    return this.api.VerifyOtp(email, otp);
  }
  public ResetPassword(body: { email: string; newPassword: string; confirmPassword: string }) {
    return this.api.ResetPassword(body);
  }

  // 2. Dashboard Statistics & Analytics
  public GetDashboardStatistics() {
    return this.api.GetDashboardStatistics();
  }
  public GetAnalytics(body: any = {}) {
    return this.api.GetAnalytics(body);
  }

  // 3. Audit Logs
  public GetAuditLogs() {
    return this.api.GetAuditLogs();
  }
  public GetAuditLogsFiltered(filters: any) {
    return this.api.GetAuditLogsFiltered(filters);
  }

  // 4. User Management
  public GetUsers() {
    return this.api.GetUsers();
  }
  public GetUsersFiltered(filters: any) {
    return this.api.GetUsersFiltered(filters);
  }
  public UpdateUserStatus(userId: number, action: string) {
    return this.api.UpdateUserStatus(userId, action);
  }

  // 5. Preventive Care & Vaccines
  public GetPreventiveCare() {
    return this.api.GetPreventiveCare();
  }
  public AddPregnancyStage(body: any) {
    return this.api.AddPregnancyStage(body);
  }
  public UpdatePregnancyStage(body: any) {
    return this.api.UpdatePregnancyStage(body);
  }
  public TogglePregnancyStageStatus(stageId: number) {
    return this.api.TogglePregnancyStageStatus(stageId);
  }
  public AddChildVaccine(body: any) {
    return this.api.AddChildVaccine(body);
  }
  public UpdateChildVaccine(body: any) {
    return this.api.UpdateChildVaccine(body);
  }
  public AddPregnancyVaccine(body: any) {
    return this.api.AddPregnancyVaccine(body);
  }
  public UpdatePregnancyVaccine(body: any) {
    return this.api.UpdatePregnancyVaccine(body);
  }

  // 6. Content Management
  public GetAllContent(filters: any = {}) {
    return this.api.GetAllContent(filters);
  }
  public UploadContent(body: any) {
    return this.api.UploadContent(body);
  }
  public UpdateContent(body: any) {
    return this.api.UpdateContent(body);
  }
  public IncrementContentView(id: number) {
    return this.api.IncrementContentView(id);
  }
  public ContentStatus(id: number, isActive?: boolean) {
    return this.api.ContentStatus(id, isActive);
  }
  public ToggleContentStatus(id: number, isActive?: boolean) {
    return this.api.ToggleContentStatus(id, isActive);
  }

  // 7. Health Awareness
  public GetHealthAwareness(filters: any = {}) {
    return this.api.GetHealthAwareness(filters);
  }
  public CreateHealthAwareness(body: any) {
    return this.api.CreateHealthAwareness(body);
  }
  public SaveHealthAwareness(body: any) {
    return this.api.SaveHealthAwareness(body);
  }
  public ToggleHealthAwarenessStatus(id: number | string, isActive: boolean) {
    return this.api.ToggleHealthAwarenessStatus(id, isActive);
  }
  public DeleteHealthAwareness(id: number | string) {
    return this.api.DeleteHealthAwareness(id);
  }
  public GetHealthCategories(body: any = {}) {
    return this.api.GetHealthCategories(body);
  }
  public GetMedicalCategories(body: any = {}) {
    return this.api.GetMedicalCategories(body);
  }
  public GetCategories(body: any = {}) {
    return this.api.GetCategories(body);
  }

  // 8. Healthcare Champions
  public GetHealthcareChampions(filters: any = {}) {
    return this.api.GetHealthcareChampions(filters);
  }
  public CreateHealthcareChampion(body: any) {
    return this.api.CreateHealthcareChampion(body);
  }
  public SaveHealthcareChampion(body: any) {
    return this.api.SaveHealthcareChampion(body);
  }
  public ToggleHealthcareChampionStatus(id: number | string, isActive: boolean) {
    return this.api.ToggleHealthcareChampionStatus(id, isActive);
  }
  public DeleteHealthcareChampion(id: number | string) {
    return this.api.DeleteHealthcareChampion(id);
  }

  // 9. Home Remedies
  public GetHomeRemedies(filters: any = {}) {
    return this.api.GetHomeRemedies(filters);
  }
  public CreateHomeRemedy(body: any) {
    return this.api.CreateHomeRemedy(body);
  }
  public UpdateHomeRemedy(body: any) {
    return this.api.UpdateHomeRemedy(body);
  }
  public SaveHomeRemedy(body: any) {
    return this.api.SaveHomeRemedy(body);
  }
  public ToggleHomeRemedyStatus(id: number | string, isActive: boolean) {
    return this.api.ToggleHomeRemedyStatus(id, isActive);
  }
  public DeleteHomeRemedy(id: number | string) {
    return this.api.DeleteHomeRemedy(id);
  }
  public GetHomeRemedyCategories(body: any = {}) {
    return this.api.GetHomeRemedyCategories(body);
  }

  // 10. Support Groups
  public GetSupportGroups(filters: any = {}) {
    return this.api.GetSupportGroups(filters);
  }
  public CreateSupportGroup(body: any) {
    return this.api.CreateSupportGroup(body);
  }
  public UpdateSupportGroup(body: any) {
    return this.api.UpdateSupportGroup(body);
  }
  public SaveSupportGroup(body: any) {
    return this.api.SaveSupportGroup(body);
  }
  public ToggleSupportGroupStatus(id: number | string, isActive: boolean) {
    return this.api.ToggleSupportGroupStatus(id, isActive);
  }
  public DeleteSupportGroup(id: number | string) {
    return this.api.DeleteSupportGroup(id);
  }
  public JoinSupportGroupMember(groupId: string, memberData: any) {
    return this.api.JoinSupportGroupMember(groupId, memberData);
  }

  // 11. Doctor Management
  public GetDoctors(filters: any = {}) {
    return this.api.GetDoctors(filters);
  }
  public EditDoctor(body: any) {
    return this.api.EditDoctor(body);
  }
  public ToggleDoctorStatus(body: { id: number; isActive: boolean }) {
    return this.api.ToggleDoctorStatus(body);
  }
  public GetDoctorAvailability(body: { id: number | string }) {
    return this.api.GetDoctorAvailability(body);
  }
  public UpdateDoctorAvailability(body: any) {
    return this.api.UpdateDoctorAvailability(body);
  }
  public SaveDoctorAvailability(body: any) {
    return this.api.SaveDoctorAvailability(body);
  }

  // 12. Doctor Approvals
  public GetDoctorApprovals(filters?: any) {
    return this.api.GetDoctorApprovals(filters);
  }
  public UpdateDoctorApprovalStatus(body: { id: number; status: 'APPROVED' | 'REJECTED'; rejectionReason?: string }) {
    return this.api.UpdateDoctorApprovalStatus(body);
  }
  public VerifyDoctorDocument(body: { documentId: number | string; isVerified?: boolean; [key: string]: any }) {
    return this.api.VerifyDoctorDocument(body);
  }
  public GetDocumentBlob(url: string) {
    return this.api.GetDocumentBlob(url);
  }

  // 13. Appointments
  public GetAppointments(filters?: any) {
    return this.api.GetAppointments(filters);
  }
  public MarkAppointmentComplete(body: any) {
    return this.api.MarkAppointmentComplete(body);
  }
  public CancelAppointment(body: any) {
    return this.api.CancelAppointment(body);
  }

  // 14. Notifications
  public GetNotifications(filters: any = {}) {
    return this.api.GetNotifications(filters);
  }
  public CreateNotification(body: any) {
    return this.api.CreateNotification(body);
  }
  public GetTargetAudiences(body: any = {}) {
    return this.api.GetTargetAudiences(body);
  }
  public GetDate(date: any) {    
    // return moment(new Date(date), "YYYYMMDD").fromNow();
    return moment(new Date(date), "DD/MM/YYYY").format('l');
  }
  public async share(title: any, text: any, url: any): Promise<any> {
    if (this.isBrowser && window.navigator.share) {
      const shareData = { title, text, url };
      try {
        return new Promise(async (resolve, reject) => {
          (this.isBrowser) ? await window.navigator.share(shareData) : null;
          return resolve('Shared success'), reject
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      this.SwalError('Oops!', 'Share API is not supporting on your browser.')
    }

  }
  public generateTags(tags: any) {
    tags = {
      title: "Active Life",
      description: "Active Life Admin Dashboard",
      keywords: "active life, admin, health",
      image: "/favicon.ico",
      path: "", ...tags,
    };
    this.title.setTitle(tags.title);
    this.meta.updateTag({ name: "Description", content: tags.description });
    this.meta.updateTag({ name: "Keywords", content: tags.keywords });
    this.meta.updateTag({ property: "og:title", content: tags.title });
    this.meta.updateTag({ property: "og:description", content: tags.description });
  }
  public OpenPopup(content: any, selclass = "My_Popup", size = 'lg') {
    this.modalReference = this.modalService.open(content, { centered: true, windowClass: selclass, size });
  }
  public CloseModal() {
    this.modalReference ? this.modalReference.close() : "";
  }
  public GotoURLParam(url: string) {
    this.router.navigateByUrl(url);
  }
  public toggleOverflow() {
    if (this.isBrowser) {
      (this.showMenu) ? this.renderer.addClass(window.document.body, 'overflowx') : this.renderer.removeClass(window.document.body, 'overflowx');
      (this.showMenu) ? this.renderer.addClass(window.document.documentElement, 'overflowx') : this.renderer.removeClass(window.document.documentElement, 'overflowx');
    }
  }
  public NoSpace(event: any) {
    return (event.keyCode === 32) ? false : true;
  }
  public restrictNumeric(e: any) {
    let input: any;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    if (e.which === 46) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }
  AlphabetsOnly(event: any) {
    const charCode = event.keyCode;
    if (
      (charCode > 64 && charCode < 91) ||
      (charCode > 96 && charCode < 123) ||
      charCode === 8 ||
      charCode === 32
    ) {
      event.target.value = event.target.value.replace(
        /[^A-Za-z0-9-,.;'&/.() ]|^ /g,
        ""
      );
      return true;
    } else {
      return false;
    }
  }
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  public GoTo($element: any): void {
    $element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
  ToastClear() {
    this.toastr.clear();
  }
  ToastSuccess(msg: any, heading = "Success") {
    this.toastr.success(msg, heading, {
      enableHtml: true,
      closeButton: true,
    });
  }
  ToastWarning(msg: any, heading = "Warning") {
    this.toastr.warning(msg, heading, {
      enableHtml: true,
      closeButton: true,
    });
  }
  ToastError(msg: any, heading = "Error") {
    this.toastr.error(msg, heading, {
      enableHtml: true,
      closeButton: true,
    });
  }
  public SwalSuccess(msg: string, heading = "Success!") {
    Swal.fire({
      title: heading,
      text: msg,
      icon: "success",
      confirmButtonColor: "#7e3f97",
    });
  }
  public SwalWarning(msg: any, heading = "Warning") {
    Swal.fire(heading, msg);
  }
  public SwalError(msg: any, heading = "Error") {
    Swal.fire(heading, msg);
  }
  public Swalhtml(Heading: any, msg: any) {
    Swal.fire({
      title: Heading,
      html: msg,
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false,
    });
  }
  // ENCRYPTION
  public Encrypt(o: any, salt: any) {
    o = JSON.stringify(o).split("");
    for (let i = 0, l = o.length; i < l; i++) {
      if (o[i] === "{") {
        o[i] = "}";
      } else if (o[i] === "}") {
        o[i] = "{";
      }
    }
    return btoa(encodeURI(salt + o.join("")));
  }
  public Decrypt(o: any, salt: any) {
    o = decodeURI(atob(o));
    if (salt && o.indexOf(salt) !== 0) {
      throw new Error("object cannot be decrypted");
    }
    o = o.substring(salt.length).split("");
    for (let i = 0, l = o.length; i < l; i++) {
      if (o[i] === "{") {
        o[i] = "}";
      } else if (o[i] === "}") {
        o[i] = "{";
      }
    }
    return JSON.parse(o.join(""));
  }
  // LOCALSTORAGE
  public GetLS$(key: any, storageArea: any = "localStorage"): Observable<any> {
    let LData$: Observable<any>;
    LData$ = this.storageService.storageChange$.pipe(filter((o: any) => o.key === key), pluck("value"));
    const D: any = (this.isBrowser) ? this.storageService.getStorageItem({ key, storageArea }) : null;
    return LData$ = LData$.pipe(startWith((D) ? D : null))
  }
  public SetLS$(key: string, value: string, storageArea: any = "localStorage"): void {
    this.storageService.setStorageItem({ key, value, storageArea });
  }
  logout() {
    Swal.fire({
      title: "Are you sure?",
      text: "Want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout!",
      cancelButtonText: "No, Continue",
    }).then((result: any) => {
      if (result.value) {
        this.GotoURLParam('/');
        this.SetLS$(this.Token, JSON.stringify(null));
      }
    });
  }
  public ConvertKeysToLowerCase(obj: any) {
    const output: any = {};
    for (const i in obj) {
      if (Object.prototype.toString.apply(obj[i]) === "[object Object]") {
        output[i.toLowerCase()] = this.ConvertKeysToLowerCase(obj[i]);
      } else if (Object.prototype.toString.apply(obj[i]) === "[object Array]") {
        output[i.toLowerCase()] = [];
        output[i.toLowerCase()].push(this.ConvertKeysToLowerCase(obj[i][0]));
      } else {
        output[i.toLowerCase()] = obj[i];
      }
    }
    return output;
  }
}
