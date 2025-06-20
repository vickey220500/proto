import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn:'root'})

export class commonService{
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  sendData(data: any,url:string) {
    return this.http.post(`${this.baseUrl}/${url}`, data);
  }
  getData(url:string) {
    return this.http.get(`${this.baseUrl}/${url}`);
  }
}
