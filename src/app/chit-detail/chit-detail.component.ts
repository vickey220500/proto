import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
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
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
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
  chitGroups: any[] = [];
  selectedChitGroup: any = null;
  chitList: any[] = [];
  selectedChitId: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: commonService,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.chitId = this.route.snapshot.queryParams['chitId'];
    // load supporting lists
    this.loadChitGroups();
    this.loadChitList();

    if (this.chitId) {
      this.selectedChitId = this.chitId;
      this.loadChitMemberDetails(this.chitId);
      this.loadTransactions(this.chitId);
    } else {
      this.utilService.openSwal('Chit ID not found', 'error', 'error', 'OK');
      this.router.navigate(['/chitList']);
    }
  }

  loadChitMemberDetails(chitId?: string) {
    const id = chitId || this.chitId;
    if (!id) return;
    this.commonService.getData('/chitMemberDetail', { chitId: id }).subscribe({
      next: (response: any) => {
        this.chitMember = response.data;
        if (this.chitGroups && this.chitMember?.groupId) {
          this.selectedChitGroup = this.chitGroups.find(g => g.id === this.chitMember.groupId) || null;
        }
        this.loading = false;
      },
      error: (error) => {
        this.utilService.openSwal('Error loading chit member details', 'error', 'error', 'OK');
        this.loading = false;
      }
    });
  }

  loadTransactions(chitId?: string) {
    const id = chitId || this.chitId;
    if (!id) return;
    this.commonService.getData('/chitTransactionDetail', { chitId: id }).subscribe({
      next: (response: any) => {
        this.transactions = response.data || [];
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
      }
    });
  }

  loadChitGroups() {
    this.commonService.getData('/chitGroups', {}).subscribe({
      next: (response: any) => {
        this.chitGroups = response?.data || response || [];
        if (this.chitMember && this.chitMember.groupId) {
          this.selectedChitGroup = this.chitGroups.find(g => g.id === this.chitMember.groupId) || null;
        }
      },
      error: (err) => {
        console.error('Error loading chit groups', err);
      }
    });
  }

  loadChitList() {
    this.commonService.getData('/chitList', {}).subscribe({
      next: (response: any) => {
        this.chitList = response?.data || response || [];
        if (this.chitId) {
          const found = this.chitList.find((c: any) => c.chitId === this.chitId || c.id === this.chitId);
          this.selectedChitId = found || this.chitId;
        }
      },
      error: (err) => {
        console.error('Error loading chit list', err);
      }
    });
  }

  onChitIdChange(selected: any) {
    const selectedId = selected?.chitId || selected?.id || selected;
    if (!selectedId) return;
    this.chitId = selectedId;
    this.loadChitMemberDetails(this.chitId);
    this.loadTransactions(this.chitId);
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
