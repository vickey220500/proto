import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-daily-loan-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,  MatCardModule,
    MatTableModule,
    MatPaginatorModule,MatIconModule,RouterModule],
  templateUrl: './daily-loan-list.component.html',
  styleUrl: './daily-loan-list.component.scss'
})
export class DailyLoanListComponent {
   dataSource : any= [
  {
    "firstName": "Vignesh",
    "lastName": "Kumar",
    "aadharNo": 123456789012,
    "address": "123, Gandhi Street, Chennai",
    "age": 28,
    "borrowAmount": 50000,
    "interest": 7.5,
    "email": "vignesh.k@example.com",
    "mobileNumber": 9876543210,
    "panCardNumber": "ABCDE1234F",
    "pincode": 600001,
    "profilePic": { "data": "base64", "contentType": "image/png" }
  },
  {
    "firstName": "Suresh",
    "lastName": "R",
    "aadharNo": 234567890123,
    "address": "56, Anna Nagar, Chennai",
    "age": 32,
    "borrowAmount": 60000,
    "interest": 8.0,
    "email": "suresh.r@example.com",
    "mobileNumber": 9876543211,
    "panCardNumber": "FGHIJ5678K",
    "pincode": 600002,
    "profilePic": { "data": "base64", "contentType": "image/png" }
  },
  {
    "firstName": "Priya",
    "lastName": "D",
    "aadharNo": 345678901234,
    "address": "789, T Nagar, Chennai",
    "age": 26,
    "borrowAmount": 45000,
    "interest": 7.0,
    "email": "priya.d@example.com",
    "mobileNumber": 9876543212,
    "panCardNumber": "LMNOP3456Z",
    "pincode": 600003,
    "profilePic": { "data": "base64", "contentType": "image/png" }
  },
  {
    "firstName": "Karthik",
    "lastName": "S",
    "aadharNo": 456789012345,
    "address": "22, Velachery Main Road, Chennai",
    "age": 35,
    "borrowAmount": 70000,
    "interest": 8.5,
    "email": "karthik.s@example.com",
    "mobileNumber": 9876543213,
    "panCardNumber": "QRSTU7890L",
    "pincode": 600004,
    "profilePic": { "data": "base64", "contentType": "image/png" }
  },
  {
    "firstName": "Meena",
    "lastName": "G",
    "aadharNo": 567890123456,
    "address": "10, OMR, Chennai",
    "age": 30,
    "borrowAmount": 55000,
    "interest": 7.2,
    "email": "meena.g@example.com",
    "mobileNumber": 9876543214,
    "panCardNumber": "UVWXY6543B",
    "pincode": 600005,
    "profilePic": { "data": "base64", "contentType": "image/png" }
  },
  {
    "firstName": "Rajesh",
    "lastName": "P",
    "aadharNo": 678901234567,
    "address": "88, Adyar, Chennai",
    "age": 40,
    "borrowAmount": 80000,
    "interest": 9.0,
    "email": "rajesh.p@example.com",
    "mobileNumber": 9876543215,
    "panCardNumber": "ZABCD1122E",
    "pincode": 600006,
    "profilePic": { "data": "base64", "contentType": "image/png" }
  },
  {
    "firstName": "Divya",
    "lastName": "N",
    "aadharNo": 789012345678,
    "address": "42, Mount Road, Chennai",
    "age": 27,
    "borrowAmount": 40000,
    "interest": 6.5,
    "email": "divya.n@example.com",
    "mobileNumber": 9876543216,
    "panCardNumber": "MNOPQ1123T",
    "pincode": 600007,
    "profilePic": { "data": "base64", "contentType": "image/png" }
  },
  {
    "firstName": "Arun",
    "lastName": "B",
    "aadharNo": 890123456789,
    "address": "11, Nungambakkam, Chennai",
    "age": 29,
    "borrowAmount": 47000,
    "interest": 7.3,
    "email": "arun.b@example.com",
    "mobileNumber": 9876543217,
    "panCardNumber": "CDEFG3344H",
    "pincode": 600008,
    "profilePic": { "data": "base64", "contentType": "image/png" }
  },
  {
    "firstName": "Anitha",
    "lastName": "V",
    "aadharNo": 901234567890,
    "address": "33, Besant Nagar, Chennai",
    "age": 31,
    "borrowAmount": 52000,
    "interest": 7.8,
    "email": "anitha.v@example.com",
    "mobileNumber": 9876543218,
    "panCardNumber": "HIJKL5566M",
    "pincode": 600009,
    "profilePic": { "data": "base64", "contentType": "image/png" }
  },
  {
    "firstName": "Surya",
    "lastName": "T",
    "aadharNo": 912345678901,
    "address": "19, Perambur, Chennai",
    "age": 33,
    "borrowAmount": 63000,
    "interest": 8.2,
    "email": "surya.t@example.com",
    "mobileNumber": 9876543219,
    "panCardNumber": "NOPQR6677V",
    "pincode": 600010,
    "profilePic": { "data": "base64", "contentType": "image/png" }
  }
]

  displayedColumns: any[] = []

 coloumnDefs: any[] = [
  { key: 'profilePic', label: 'Profile Picture', type: 'image' },
  { key: 'firstName', label: 'First Name', type: 'text' },
  { key: 'lastName', label: 'Last Name', type: 'text' },
  { key: 'aadharNo', label: 'Aadhar No', type: 'text' },
  { key: 'address', label: 'Address', type: 'text' },
  { key: 'age', label: 'Age', type: 'text' },
  { key: 'borrowAmount', label: 'Borrow Amount', type: 'text' },
  { key: 'interest', label: 'Interest (%)', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'mobileNumber', label: 'Mobile No', type: 'text' },
  { key: 'panCardNumber', label: 'PAN No', type: 'text' },
  { key: 'pincode', label: 'Pincode', type: 'text' }
];
;
  // dataSource:any = [ { "firstName": "Vignesh", "lastName": "", "aadharNo": 123456789012, "address": "123, Gandhi Street, Chennai", "age": 28, "borrowAmount": 50000, "interest": 7.5, "email": "abc@example.com", "mobileNumber": 9876543210, "panCardNumber": "ABCDE1234F", "pincode": 600001, "profilePic": { "data": "base64", "contentType": "image/png" } }];
  totalRecords = 0;
  pageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadUsers(0, this.pageSize);
    this.displayedColumns = this.coloumnDefs.map(col => col.key);
    console.log('Displayed Columns:', this.displayedColumns);

  }

  loadUsers(pageIndex: number, pageSize: number) {

    // const allUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
    //   id: i + 1,
    //   name: `User ${i + 1}`,
    //   email: `user${i + 1}@example.com`,
    //   status: i % 2 === 0 ? 'Active' : 'Inactive'
    // }));

    this.totalRecords = this.dataSource.length;
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    // this.dataSource.data = allUsers.slice(start, end);
  }

  onPaginateChange(event: PageEvent) {
    this.loadUsers(event.pageIndex, event.pageSize);
  }
}


