import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { commonService } from '../services/common.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UtilService } from '../services/util.service';
@Component({
  selector: 'app-daily-loan-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,  MatCardModule,
    MatTableModule,
    MatPaginatorModule,MatIconModule,RouterModule, MatCheckboxModule],
  templateUrl: './daily-loan-list.component.html',
  styleUrl: './daily-loan-list.component.scss'
})
export class DailyLoanListComponent {
   dataSource : any= []

  displayedColumns: any[] = []

 coloumnDefs: any[] = [
  { key: 'checkbox',  type: 'checkbox' },
  { key: 'profilePic', label: 'Profile', type: 'image' },
  { key: 'name', label: 'Name', type: 'text' },
  // { key: 'firstName', label: 'First Name', type: 'text' },
  // { key: 'lastName', label: 'Last Name', type: 'text' },
  { key: 'aadharNo', label: 'Aadhar No', type: 'text' },
  { key: 'address', label: 'Address', type: 'text' },
  { key: 'age', label: 'Age', type: 'text' },
  { key: 'borrowAmount', label: 'Borrow Amount', type: 'text' },
  { key: 'interest', label: 'Interest (%)', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'mobileNumber', label: 'Mobile No', type: 'text' },
  { key: 'panCardNumber', label: 'PAN No', type: 'text' },
  { key: 'pincode', label: 'Pincode', type: 'text' },
  { key: 'createdAt', label: 'Created Date', type: 'date' }
];

dlHeaderAction:any[] = [{type:'button',label: 'Pay', action: 'apiCall', url:'/dlPayment'},{type:'button',action:'route',label: 'Add', icon: 'add',route: '/dailyLoan'},]
  // dataSource:any = [ { "firstName": "Vignesh", "lastName": "", "aadharNo": 123456789012, "address": "123, Gandhi Street, Chennai", "age": 28, "borrowAmount": 50000, "interest": 7.5, "email": "abc@example.com", "mobileNumber": 9876543210, "panCardNumber": "ABCDE1234F", "pincode": 600001, "profilePic": { "data": "base64", "contentType": "image/png" } }];
  pageSize = 5;
  selectedRows: any[] = [];
  pagedData: any[] = [];
  currentPage = 0;
  headerActions: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private commonService: commonService, public utilService:UtilService) {}

  ngOnInit() {
    this.loadData();
    this.headerActions = this.dlHeaderAction;
    this.displayedColumns = this.coloumnDefs.map(col => col.key);
    console.log('Displayed Columns:', this.displayedColumns);

  }

  loadData() {
    this.commonService.getData('dailyLoanData').subscribe((res: any) => {
    this.dataSource = res.data;
    console.log('Data Source:', this.dataSource);
    this.updatePagedData();
    });
  }

   onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedData();
  }

  updatePagedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedData = this.dataSource.slice(startIndex, endIndex);
  }

isSelected(row: any): boolean {
  return this.selectedRows.includes(row);
}

toggleRow(row: any): void {
  const index = this.selectedRows.indexOf(row);
  if (index > -1) {
    this.selectedRows.splice(index, 1);
  } else {
    this.selectedRows.push(row);
  }
}

isAllSelected(): boolean {
  return this.selectedRows.length === this.dataSource.length;
}

isIndeterminate(): boolean {
  return this.selectedRows.length > 0 && !this.isAllSelected();
}

toggleAll(): void {
  if (this.isAllSelected()) {
    this.selectedRows = [];
  } else {
    this.selectedRows = [...this.dataSource];
  }
}

checkedData() {
console.log('Selected Rows:', this.selectedRows );
}

// downloadPDF() {
// this.utilService.downloadPdf(this.dataSource);
// }

downloadExcel() {
const data = this.dataSource.map(({ profilePic, ...rest }:any) => rest);
this.utilService.downloadExcel(data);
}

  // Generate a unique color for each avatar based on the user's name
  getAvatarColor(row: any): string {
    const colors = [
      '#3f51b5', // blue
      '#e91e63', // pink
      '#4caf50', // green
      '#ff9800', // orange
      '#9c27b0', // purple
      '#009688', // teal
      '#f44336', // red
      '#607d8b', // blue grey
      '#795548', // brown
      '#2196f3', // light blue
    ];
    const name = (row.firstName || '') + (row.lastName || '');
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
}


