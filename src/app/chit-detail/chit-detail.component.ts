import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { commonService } from '../services/common.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-chit-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './chit-detail.component.html',
  styleUrl: './chit-detail.component.scss'
})
export class ChitDetailComponent implements OnInit {
  chitMember: any = {};
  transactions: any[] = [];
  loading = true;
  chitId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: commonService,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.chitId = this.route.snapshot.queryParams['chitId'];
    if (this.chitId) {
      this.loadChitMemberDetails();
      this.loadTransactions();
    } else {
      this.utilService.openSwal('Chit ID not found', 'error', 'error', 'OK');
      this.router.navigate(['/chitList']);
    }
  }

  loadChitMemberDetails() {
    this.commonService.getData('/chitMemberDetail', { chitId: this.chitId }).subscribe({
      next: (response: any) => {
        this.chitMember = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.utilService.openSwal('Error loading chit member details', 'error', 'error', 'OK');
        this.loading = false;
      }
    });
  }

  loadTransactions() {
    this.commonService.getData('/chitTransactionDetail', { chitId: this.chitId }).subscribe({
      next: (response: any) => {
        this.transactions = response.data || [];
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
      }
    });
  }

  getProgressPercentage(): number {
    if (!this.chitMember.totalMonths) return 0;
    return (this.chitMember.currentMonth / this.chitMember.totalMonths) * 100;
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'accent';
      case 'completed':
        return 'primary';
      case 'defaulted':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getPaymentStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'accent';
      case 'pending':
        return 'warn';
      case 'overdue':
        return 'warn';
      default:
        return 'primary';
    }
  }

  onBackToList() {
    this.router.navigate(['/chitList']);
  }

  onEditMember() {
    this.router.navigate(['/chit'], { queryParams: { chitId: this.chitId, mode: 'edit' } });
  }

  onAddPayment() {
    this.router.navigate(['/chit-payment'], { queryParams: { chitId: this.chitId } });
  }

  getTotalPaid(): number {
    return this.transactions
      .filter(t => t.status === 'Paid')
      .reduce((sum, t) => sum + (t.contributionAmount || 0), 0);
  }

  getTotalPending(): number {
    return this.transactions
      .filter(t => t.status === 'Pending')
      .reduce((sum, t) => sum + (t.contributionAmount || 0), 0);
  }

  getRemainingAmount(): number {
    const totalExpected = (this.chitMember.monthlyContribution || 0) * (this.chitMember.totalMonths || 0);
    return totalExpected - this.getTotalPaid();
  }
} 