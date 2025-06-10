import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-daily-loan-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,  MatCardModule,
    MatTableModule,
    MatPaginatorModule],
  templateUrl: './daily-loan-list.component.html',
  styleUrl: './daily-loan-list.component.scss'
})
export class DailyLoanListComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'status'];
  dataSource = new MatTableDataSource<User>();
  totalRecords = 0;
  pageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadUsers(0, this.pageSize); // initial load
  }

  loadUsers(pageIndex: number, pageSize: number) {
    // simulate server-side API call
    const allUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: i % 2 === 0 ? 'Active' : 'Inactive'
    }));

    this.totalRecords = allUsers.length;
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    this.dataSource.data = allUsers.slice(start, end);
  }

  onPaginateChange(event: PageEvent) {
    this.loadUsers(event.pageIndex, event.pageSize);
  }
}

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

