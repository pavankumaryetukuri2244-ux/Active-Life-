import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WebapiService {
  private readonly WebApi = environment.serviceUrl;
  constructor(
    public Http: HttpClient
  ) { }
  /// *** ///////////////////////////////  *** // 
  ///***** // OBSERVABLE FUNCTIONS /// ******
  /// *** ///////////////////////////////  *** // 
  GetBanners(type: any = '') {
    const url = `${this.WebApi}/Category/Banners?name=banner?${type}?cache`;
    return this.Http.get(url, { responseType: "json" }).pipe(map((d: any) => (d.Success === true ? d.Result.Table : false)))
  }
  /// *** ///////////////////////////////  *** // 
  ///***** // ASYNC PROMISE FUNCTIONS /// ******
  /// *** ///////////////////////////////  *** // 
  public async Login(mobile: any, password: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        const body = { condition: "login", mobile, password }
        const url = `${this.WebApi}/authentication.php`;
        return this.Http.post<any>(url, body)
          .pipe(map((d: any) => (d.status === 1) ? { status: true, data: d.info[0] } : { status: false, error: d.msg }))
          .subscribe((r: any) => resolve(r), reject);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
