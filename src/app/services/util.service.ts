import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

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
}
