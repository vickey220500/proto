import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { commonService } from '../services/common.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UtilService } from '../services/util.service';
import { Chart, ChartConfiguration } from 'chart.js';
import { ElementRef } from '@angular/core';
import dlListJson from '../../jsons/dlListJson.json';
import dplListJson from '../../jsons/dplListJson.json';
import dlTransactionDetailJson from '../../jsons/dlTransactionDetail.json';
import chitListJson from '../../jsons/chitListJson.json';
import chitDetailJson from '../../jsons/chitDetailJson.json';
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

 coloumnDefs: any[]=[];

 headerAction:any;
listData:any;
  // dataSource:any = [ { "firstName": "Vignesh", "lastName": "", "aadharNo": 123456789012, "address": "123, Gandhi Street, Chennai", "age": 28, "borrowAmount": 50000, "interest": 7.5, "email": "abc@example.com", "mobileNumber": 9876543210, "panCardNumber": "ABCDE1234F", "pincode": 600001, "profilePic": { "data": "base64", "contentType": "image/png" } }];
  pageSize = 5;
  selectedRows: any[] = [];
  pagedData: any[] = [];
  currentPage = 0;
  headerActions: any[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
chart: Chart | undefined;
showChart: boolean = false;
currentPageUrl: any;
tableDataSource:any;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  queryParams: any;

  constructor(private commonService: commonService, public utilService:UtilService,
    public router: Router,
    public route: ActivatedRoute) {}

  ngOnInit() {
    this.currentPageUrl = this.router.url.split('?')[0];
    this.queryParams=this.route.snapshot.queryParams;
    console.log(this.currentPageUrl,'currentpage',this.router,this.route.snapshot.queryParams);    
    if (this.currentPageUrl === '/dailyLoanList') {
      this.listData = dlListJson;
      this.coloumnDefs = this.listData.coloumnDefs;
      this.headerActions = this.listData.dlHeaderAction;
    } else if (this.currentPageUrl === '/dplList') {
      this.listData = dplListJson;
      this.coloumnDefs = this.listData.coloumnDefs;
      this.headerActions = this.listData.dlHeaderAction;
    } else if (this.currentPageUrl === '/dlTransactionDetail') {
      this.listData = dlTransactionDetailJson;
      this.coloumnDefs = this.listData.coloumnDefs;
      this.headerActions = this.listData.dlHeaderAction;
    } else if (this.currentPageUrl === '/chitList') {
      this.listData = chitListJson;
      this.coloumnDefs = this.listData.coloumnDefs;
      this.headerActions = this.listData.dlHeaderAction;
    } else if (this.currentPageUrl === '/chitDetail') {
      this.listData = chitDetailJson;
      this.coloumnDefs = this.listData.coloumnDefs;
      this.headerActions = this.listData.dlHeaderAction;
    }
    this.loadData();
    this.displayedColumns = this.coloumnDefs.map(col => col.key);
    console.log('Displayed Columns:', this.displayedColumns);
  }

  loadData() {
    let params:any={}
    if(this.listData?.tableDataSource?.apiDetails?.body){
      this.listData.tableDataSource.apiDetails.body.forEach((e:any)=>{
        params[e.key] = this.queryParams[e.value]
      })
    }
    this.commonService.getData(this.listData.tableDataSource.apiDetails.url,params).subscribe((res: any) => {
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

apiCall(action: any) {
console.log(action,'Selected Rows:', this.selectedRows );
let body: any[] = [];
for (let i = 0; i < this.selectedRows.length; i++) {
  let item = this.selectedRows[i];
  let obj: any = {};
  for (let j = 0; j < action.apiDetails.body.length; j++) {
    let element = action.apiDetails.body[j];
    obj[element.key] = item[element.value];
  }
  body.push(obj);
}
console.log(body,'body');
this.utilService.postApiCall(action.apiDetails.url, body).subscribe((res: any) => {
  console.log(res);
  this.utilService.openSwal('Payment Successfully', 'success', 'success', 'OK');
})
  
}

// downloadPDF() {
// this.utilService.downloadPdf(this.dataSource);
// }

downloadExcel() {
const data = this.dataSource.map(({ profilePic, ...rest }:any) => rest);
this.utilService.downloadExcel(data);
}

toggleChart(): void {
  this.showChart = !this.showChart;
  if (this.showChart) {
    setTimeout(() => {
      this.renderChart();
    }, 0); // Wait for DOM to update
  } else {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

renderChart(): void {
  const labels = this.dataSource.map((item: any) => item.firstName);
  const data = this.dataSource.map((item: any) => item.borrowAmount);

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Borrow Amount',
        data,
        backgroundColor: '#9a6735cc',
        borderColor: '#9a6735',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  if (this.chart) {
    this.chart.destroy();
  }

  const ctx = this.chartCanvas.nativeElement.getContext('2d');
  if (ctx) {
    this.chart = new Chart(ctx, config);
  }
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
  navigateToDetail(row: any, column: any) {
    if(column.apiDetails?.body?.length > 0){
      let params: any = {};
      for(let i = 0; i < column.apiDetails.body.length; i++){
        params[column.apiDetails.body[i].key] = row[column.apiDetails.body[i].value];
      }
      console.log(params,'params');      
      window.open(column.apiDetails.url + '?' + new URLSearchParams(params).toString(), '_blank');
    }
  }
}


