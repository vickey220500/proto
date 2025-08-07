import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { commonService } from '../services/common.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-chit-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './chit-payment.component.html',
  styleUrl: './chit-payment.component.scss'
})
export class ChitPaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  chitId: string = '';
  chitMember: any = {};
  loading = false;

  paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'upi', label: 'UPI' },
    { value: 'online', label: 'Online Payment' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: commonService,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.chitId = this.route.snapshot.queryParams['chitId'];
    if (this.chitId) {
      this.loadChitMemberDetails();
      this.initForm();
    } else {
      this.utilService.openSwal('Chit ID not found', 'error', 'error', 'OK');
      this.router.navigate(['/chitList']);
    }
  }

  loadChitMemberDetails() {
    this.loading = true;
    this.commonService.getData('/chitMemberDetail', { chitId: this.chitId }).subscribe({
      next: (response: any) => {
        this.chitMember = response.data;
        this.loading = false;
        this.updateFormWithMemberData();
      },
      error: (error: any) => {
        this.utilService.openSwal('Error loading chit member details', 'error', 'error', 'OK');
        this.loading = false;
      }
    });
  }

  initForm() {
    this.paymentForm = this.fb.group({
      chitId: [this.chitId, Validators.required],
      memberId: ['', Validators.required],
      memberName: ['', Validators.required],
      contributionAmount: ['', [Validators.required, Validators.min(100)]],
      month: ['', [Validators.required, Validators.min(1)]],
      paymentDate: [new Date(), Validators.required],
      paymentMethod: ['cash', Validators.required],
      transactionId: [''],
      remarks: ['']
    });
  }

  updateFormWithMemberData() {
    this.paymentForm.patchValue({
      memberId: this.chitMember.memberId,
      memberName: this.chitMember.memberName,
      contributionAmount: this.chitMember.monthlyContribution,
      month: this.chitMember.currentMonth
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const formData = this.paymentForm.value;
      
      // Generate transaction ID if not provided
      if (!formData.transactionId) {
        formData.transactionId = 'TXN' + Date.now();
      }
      
      // Set status
      formData.status = 'Paid';
      
      this.loading = true;
      this.commonService.sendData(formData, 'addChitPayment').subscribe({
        next: (response: any) => {
          this.utilService.openSwal('Payment added successfully!', 'success', 'success', 'OK');
          this.router.navigate(['/chitDetail'], { queryParams: { chitId: this.chitId } });
        },
        error: (error: any) => {
          this.utilService.openSwal('Error adding payment', 'error', 'error', 'OK');
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    this.router.navigate(['/chitDetail'], { queryParams: { chitId: this.chitId } });
  }

  generateTransactionId() {
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    this.paymentForm.patchValue({ transactionId });
  }
} 