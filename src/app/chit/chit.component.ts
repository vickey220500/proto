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
import { Router, ActivatedRoute } from '@angular/router';
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
  chitGroupForm!: FormGroup;
  isLinear = true;
  showGroupForm = false;
  chitList: any[] = [];
  selectedChitId: any = null;

  constructor(
    private fb: FormBuilder,
    private commonService: commonService,
    private utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
    this.initGroupForm();

    // Check if coming from chitList with mode=group
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'group') {
        this.showGroupForm = true;
      }
      if (params['chitId']) {
        this.selectedChitId = params['chitId'];
      }
    });

    // load chit list for dropdown
    this.loadChitList();
  }

  loadChitList() {
    this.commonService.getData('/chitGroups', {}).subscribe({
      next: (response: any) => {
        // response.data could be array or object
        this.chitList = response?.data || response || [];
        // if route provided chitId, attempt to load its details
        if (this.selectedChitId) {
          // try to find in list
          const found = this.chitList.find((c: any) => c.chitId === this.selectedChitId || c.id === this.selectedChitId);
          if (found) {
            this.onChitIdChange(found);
          } else {
            // fallback: request server for specific chit
            this.onChitIdChange(this.selectedChitId);
          }
        }
      },
      error: (err) => {
        console.error('Error loading chit list', err);
      }
    });
  }

  initGroupForm() {
    this.chitGroupForm = this.fb.group({
      groupName: ['', [Validators.required, Validators.minLength(3)]],
      chitAmount: ['', [Validators.required, Validators.min(10000)]],
      totalMonths: ['', [Validators.required, Validators.min(12), Validators.max(60)]],
      monthlyContribution: ['', [Validators.required, Validators.min(1000)]],
      startDate: ['', Validators.required]
    });
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

      this.commonService.sendData(formData, 'registerChitMember').subscribe({
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

  calculateGroupMonthlyContribution() {
    const chitAmount = this.chitGroupForm.get('chitAmount')?.value;
    const totalMonths = this.chitGroupForm.get('totalMonths')?.value;

    if (chitAmount && totalMonths && totalMonths > 0) {
      const monthlyContribution = Math.ceil(chitAmount / totalMonths);
      this.chitGroupForm.get('monthlyContribution')?.setValue(monthlyContribution, { emitEvent: false });
    }
  }

  /**
   * Called when user selects a chit ID from the dropdown in the form.
   * Accepts either the chit object or an id string.
   */
  onChitIdChange(selected: any) {
    const selectedId = selected?.chitId || selected?.id || selected;
    if (!selectedId) return;
    this.selectedChitId = selectedId;

    // Try to find the selected chit in already loaded list
    const found = this.chitList.find((c: any) => c.chitId === selectedId || c.id === selectedId) || null;
    if (found) {
      this.patchChitDetailsFromObject(found);
      return;
    }

    // If not found locally, request backend for this chit
    this.commonService.getData('/chitList', { chitId: selectedId }).subscribe({
      next: (response: any) => {
        const data = response?.data || response;
        const chitObj = Array.isArray(data) ? data[0] : data;
        if (chitObj) {
          this.patchChitDetailsFromObject(chitObj);
        }
      },
      error: (err) => {
        console.error('Error loading selected chit details', err);
      }
    });
  }

  private patchChitDetailsFromObject(obj: any) {
    const chitDetailsGroup = this.chitForm.get('chitDetails') as FormGroup;
    if (!chitDetailsGroup) return;

    const patch: any = {};
    if (obj.chitAmount !== undefined) patch.chitAmount = obj.chitAmount;
    if (obj.totalMonths !== undefined) patch.totalMonths = obj.totalMonths;
    if (obj.monthlyContribution !== undefined) patch.monthlyContribution = obj.monthlyContribution;
    if (obj.startDate) {
      // convert to Date if it's a string
      patch.startDate = obj.startDate instanceof Date ? obj.startDate : new Date(obj.startDate);
    }

    chitDetailsGroup.patchValue(patch);

    // Recalculate monthly contribution if only amount and months present
    this.calculateMonthlyContribution();
  }

  submitChitGroup() {
    if (this.chitGroupForm.valid) {
      const payload = {
        groupName: this.chitGroupForm.get('groupName')?.value,
        chitAmount: this.chitGroupForm.get('chitAmount')?.value,
        totalMonths: this.chitGroupForm.get('totalMonths')?.value,
        monthlyContribution: this.chitGroupForm.get('monthlyContribution')?.value,
        startDate: this.chitGroupForm.get('startDate')?.value,
        status: 'Active'
      };

      this.commonService.sendData(payload,'createChitGroup').subscribe({
        next: (response: any) => {
          this.utilService.openSwal('Chit group created successfully!', 'success', 'success', 'OK');
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.utilService.openSwal('Error creating chit group', 'error', 'error', 'OK');
        }
      });
    }
  }
}
