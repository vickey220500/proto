import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }

  openSwal(title: string,text: any,icon: any,confirmButtonText: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: confirmButtonText,
    });
      }

  downloadExcel(data: any[], fileName: string = 'data.xlsx') {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
}

postApiCall(url: string, body: any[]) {
  return this.http.post(`${this.baseUrl}${url}`, {data:body});
}
getApiCall(url: string) {
  return this.http.get(`${this.baseUrl}${url}`);
} 

}
