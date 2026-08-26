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
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public sitepath = 'https://www.replaceprojectname.com'
  public isSpinnerVisible = signal(false);
  public showMenu: boolean = false;
  public showCart: boolean = false;
  public showAuth: boolean = false;

  public pcart: boolean = false;
  public bcart: boolean = false;
  public Token = 'replaceprojectnameweb' + this.GetDate(new Date());
  public isBrowser: boolean;
  private renderer: Renderer2;
  public setlang = 'INR';
  public isLoggedIn$: Observable<boolean>;
  public refreshLogin$ = new BehaviorSubject<boolean>(false);
  public OrderSuccess: any;
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
    private toastr: ToastrService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(platformId);
    config.backdrop = "static";
    config.keyboard = false;
    this.isLoggedIn$ = this.GetLS$(this.Token, "localStorage").pipe(map(o => (o && o !== 'null') ? true : false))    
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
      title: "replaceprojectname",
      description: "",
      keywords: "",
      image: "/assets/images/jpg/home.jpg",
      path: "", ...tags,
    };
    // Set a title
    this.title.setTitle(tags.title);
    this.meta.updateTag({ name: "Description", content: tags.description });
    this.meta.updateTag({ name: "Keywords", content: tags.keywords });
    // Set meta tags
    this.meta.updateTag({ name: "twitter:card", content: "summary" });
    this.meta.updateTag({ name: "twitter:site", content: "@replaceprojectname" });
    this.meta.updateTag({ name: "twitter:title", content: tags.title });
    this.meta.updateTag({
      name: "twitter:description",
      content: tags.description,
    });
    this.meta.updateTag({ name: "twitter:image", content: tags.image });
    this.meta.updateTag({ property: "fb:app_id", content: "182752693091917" });
    this.meta.updateTag({ property: "og:type", content: "product" });
    this.meta.updateTag({ property: "og:site_name", content: "replaceprojectname" });
    this.meta.updateTag({ property: "og:title", content: tags.title });
    this.meta.updateTag({
      property: "og:description",
      content: tags.description,
    });
    this.meta.updateTag({ property: "og:image", content: tags.image });
    this.meta.updateTag({
      property: "og:url",
      content: this.sitepath + "/" + tags.path,
    });
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
  public loadRAutocomplete(file: any) {
    const node = document.createElement("script");
    node.src = `${file}`;
    node.type = "text/javascript";
    node.async = true;
    node.defer = true;
    document.getElementsByTagName("head")[0].appendChild(node);
  }
  public toggleOverflow() {

    if (this.isBrowser) {
      (this.showMenu) ? this.renderer.addClass(window.document.body, 'overflowx') : this.renderer.removeClass(window.document.body, 'overflowx');
      (this.showMenu) ? this.renderer.addClass(window.document.documentElement, 'overflowx') : this.renderer.removeClass(window.document.documentElement, 'overflowx');
      (this.showCart) ? this.renderer.addClass(window.document.body, 'overflowx') : this.renderer.removeClass(window.document.body, 'overflowx');
      (this.showCart) ? this.renderer.addClass(window.document.documentElement, 'overflowx') : this.renderer.removeClass(window.document.documentElement, 'overflowx');
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
  public bowlGoTo($element: any): void {
    $element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
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
