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
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { commonService } from '../services/common.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-chit',
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
    MatStepperModule
  ],
  templateUrl: './chit.component.html',
  styleUrl: './chit.component.scss'
})
export class ChitComponent implements OnInit {
  chitForm!: FormGroup;
  isLinear = true;

  constructor(
    private fb: FormBuilder,
    private commonService: commonService,
    private utilService: UtilService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    // Use nested FormGroups so each mat-step can validate only its own controls
    this.chitForm = this.fb.group({
      personal: this.fb.group({
        memberName: ['', Validators.required],
        aadharNo: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
        panCardNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
        email: ['', [Validators.required, Validators.email]],
        mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        age: ['', [Validators.required, Validators.min(18), Validators.max(65)]]
      }),

      address: this.fb.group({
        address: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
      }),

      chitDetails: this.fb.group({
        chitAmount: ['', [Validators.required, Validators.min(10000)]],
        totalMonths: ['', [Validators.required, Validators.min(12), Validators.max(60)]],
        monthlyContribution: ['', [Validators.required, Validators.min(1000)]],
        startDate: ['', Validators.required]
      }),

      emergency: this.fb.group({
        emergencyContactName: ['', Validators.required],
        emergencyContactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        emergencyContactRelation: ['', Validators.required]
      })
    });
  }

  onSubmit() {
    if (this.chitForm.valid) {
      // Merge nested groups into a single payload expected by backend
      const personal = this.chitForm.get('personal')?.value || {};
      const address = this.chitForm.get('address')?.value || {};
      const chitDetails = this.chitForm.get('chitDetails')?.value || {};
      const emergency = this.chitForm.get('emergency')?.value || {};

      const formData = {
        ...personal,
        ...address,
        ...chitDetails,
        ...emergency
      };

      // Generate chit ID and metadata
      formData.chitId = 'CHIT' + Date.now();
      formData.status = 'Active';
      formData.currentMonth = 1;

      this.commonService.sendData(formData, 'addChitMember').subscribe({
        next: (response: any) => {
          this.utilService.openSwal('Chit member added successfully!', 'success', 'success', 'OK');
          this.router.navigate(['/chitList']);
        },
        error: (error: any) => {
          this.utilService.openSwal('Error adding chit member', 'error', 'error', 'OK');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    // Mark all nested controls as touched
    Object.keys(this.chitForm.controls).forEach(groupKey => {
      const group = this.chitForm.get(groupKey) as FormGroup;
      if (group && group.controls) {
        Object.keys(group.controls).forEach(ctrl => {
          const c = group.get(ctrl);
          c?.markAsTouched();
        });
      } else {
        const control = this.chitForm.get(groupKey);
        control?.markAsTouched();
      }
    });
  }

  onCancel() {
    this.router.navigate(['/chitList']);
  }

  // Calculate monthly contribution based on chit amount and total months
  calculateMonthlyContribution() {
    const chitAmount = this.chitForm.get('chitDetails.chitAmount')?.value || this.chitForm.get('chitDetails')?.get('chitAmount')?.value;
    const totalMonths = this.chitForm.get('chitDetails.totalMonths')?.value || this.chitForm.get('chitDetails')?.get('totalMonths')?.value;

    if (chitAmount && totalMonths) {
      const monthlyContribution = Math.ceil(chitAmount / totalMonths);
      const chitDetailsGroup = this.chitForm.get('chitDetails') as FormGroup;
      chitDetailsGroup?.patchValue({ monthlyContribution });
    }
  }
} 