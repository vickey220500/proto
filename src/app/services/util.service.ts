import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

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


// downloadPDF(data: any[], fileName: string = 'data.pdf') {
//   const doc = new jsPDF();

//   if (!data || data.length === 0) {
//     doc.text('No data available', 10, 10);
//   } else {
//     const headers = [Object.keys(data[0])];
//     const rows = data.map(item => Object.values(item));

//     autoTable(doc, {
//       head: headers,
//       body: rows,
//       startY: 20,
//     });
//   }

//   doc.save(fileName);
// }
}
