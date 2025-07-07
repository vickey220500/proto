import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({providedIn:'root'})

export class commonService{
  private baseUrl = 'http://localhost:3000/api';
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {}

  sendData(data: any,url:string) {
    return this.http.post(`${this.baseUrl}/${url}`, data);
  }
  getData(url:string) {
    return this.http.get(`${this.baseUrl}/${url}`);
  }
  register(userName: string, password: string, role: string,email:string,phoneNumber:string,aadharNo:string,pancard:string,pincode:string,address:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, {userName,
      email,
      password,
      phoneNumber,
      aadharNo,
      pancard,
      pincode,
      address, role });
  }


  login(userId: string, password: string): Observable<any> {
    const payload = { userId, password };
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

   setUsername(username: string) {
    this.usernameSubject.next(username);
  }

  getUsername(): string | null {
    return this.usernameSubject.value;
  }
}
