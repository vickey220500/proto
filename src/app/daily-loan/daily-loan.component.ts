import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { commonService } from '../services/common.service';
import { UtilService } from '../services/util.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-daily-loan',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './daily-loan.component.html',
  styleUrl: './daily-loan.component.scss',
})
export class DailyLoanComponent {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  videoStream: MediaStream | null = null;
  dailyLoan: any = [
    {
      type: 'text',
      label: 'First Name',
      formControl: 'firstName',
      mandatory: true,
    },
    {
      type: 'text',
      label: 'Customer Type',
      formControl: 'customerType',
      mandatory: true,
      hidden: true,
      value: 'new',
    },
    { type: 'text', label: 'Last Name', formControl: 'lastName' },
    { type: 'number', label: 'Age', formControl: 'age', mandatory: true },
    { type: 'text', label: 'Address', formControl: 'address', mandatory: true },
    {
      type: 'number',
      label: 'Mobile No',
      formControl: 'mobileNumber',
      mandatory: true,
    },
    {
      type: 'email',
      label: 'Email',
      formControl: 'email',
      mandatory: false,
    },
    {
      type: 'number',
      label: 'Addhar No',
      formControl: 'aadharNo',
      mandatory: true,
    },
    {
      type: 'text',
      label: 'PAN No',
      formControl: 'panCardNumber',
      mandatory: false,
    },
    {
      type: 'number',
      label: 'Pincode',
      formControl: 'pincode',
      mandatory: true,
    },
    {
      type: 'number',
      label: 'Borrow Amount',
      formControl: 'borrowAmount',
      mandatory: true,
      changeLogic: [{
          targetField: 'perDayAmount',
          details: {
            method: 'division',
            fields: ['borrowAmount', 'noOfDays'],
          },
        }]
    },
    {
      type: 'number',
      label: 'Interest',
      formControl: 'interest',
      mandatory: true,
      changeLogic: [
        {
          targetField: 'interestAmount',
          details: {
            method: 'percentage',
            fields: ['borrowAmount', 'interest'],
          },
        },
        {
          targetField: 'calculatedAmount',
          details: {
            method: 'subtraction',
            fields: ['borrowAmount', 'interestAmount'],
          },
        }
      ],
    },
    {
      type: 'number',
      label: 'Interest Amount',
      formControl: 'interestAmount',
      mandatory: true,
      hidden: true,
    },
    {
      type: 'number',
      label: 'No. of Days',
      formControl: 'noOfDays',
      mandatory: true,
      hidden: true,
      value:100
    },
    {
      type: 'number',
      label: 'Per Day Amount',
      formControl: 'perDayAmount',
      mandatory: true,
      readOnly: true,
    },
    {
      type: 'number',
      label: 'Calculated Amount',
      formControl: 'calculatedAmount',
      mandatory: true,
      readOnly: true,
    },
    {
      type: 'image',
      label: 'Profile',
      formControl: 'profilePic',
      mandatory: true,
    },
  ];
  dpl: any = [
    {
      type: 'text',
      label: 'First Name',
      formControl: 'firstName',
      mandatory: true,
    },
    {
      type: 'text',
      label: 'Customer Type',
      formControl: 'customerType',
      mandatory: true,
      hidden: true,
      value: 'new',
    },
    { type: 'text', label: 'Last Name', formControl: 'lastName' },
    { type: 'number', label: 'Age', formControl: 'age', mandatory: true },
    { type: 'text', label: 'Address', formControl: 'address', mandatory: true },
    {
      type: 'number',
      label: 'Mobile No',
      formControl: 'mobileNumber',
      mandatory: true,
    },
    {
      type: 'email',
      label: 'Email',
      formControl: 'email',
      mandatory: false,
    },
    {
      type: 'number',
      label: 'Addhar No',
      formControl: 'aadharNo',
      mandatory: true,
    },
    {
      type: 'text',
      label: 'PAN No',
      formControl: 'panNo',
      mandatory: false,
    },
    {
      type: 'number',
      label: 'Pincode',
      formControl: 'pincode',
      mandatory: true,
    },
    {
      type: 'number',
      label: 'Borrow Amount',
      formControl: 'borrowAmount',
      mandatory: true,
    },
    {
      type: 'number',
      label: 'Interest',
      formControl: 'interest',
      mandatory: true,
    },
    {
      type: 'number',
      label: 'Interest Amount',
      formControl: 'interestAmount',
      mandatory: true,
      hidden: true,
    },
    {
      type: 'number',
      label: 'No. of Days',
      formControl: 'noOfDays',
      mandatory: true,
       changeLogic: [
        {
          targetField: 'interestAmount',
          details: {
            method: 'percentage',
            fields: ['borrowAmount', 'interest'],
          },
        },
        {
          targetField: 'calculatedAmount',
          details: {
            method: 'addition',
            fields: ['borrowAmount', 'interestAmount'],
          },
        },
      ],
    },
    {
      type: 'number',
      label: 'Calculated Amount',
      formControl: 'calculatedAmount',
      mandatory: true,
      readOnly: true,
    },
    {
      type: 'image',
      label: 'Profile',
      formControl: 'profilePic',
      mandatory: true,
    },
  ];
  fieldConfigure: any = [];
  form!: FormGroup;
  title: string = 'Daily Loan Form';
  breadcrumbItems: any = [];
  base64Image: string | null = null;
  showImageModal: boolean = false;
  showCaptureModal: boolean = false;
  currentPage: any;

  constructor(
    public fb: FormBuilder,
    public snackBar: MatSnackBar,
    public commonService: commonService,
    public utilService: UtilService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    // Initialization logic can go here
  }
  ngOnInit(): void {
    // this.route.snapshot
    this.currentPage = this.router.url;
    if (this.currentPage === '/dailyLoan') {
      this.fieldConfigure = this.dailyLoan;
      this.title = 'Daily Loan Form';
      this.breadcrumbItems = [
        { label: 'Daily Loan' },
        { label: 'Daily Loan Form', active: true },
      ];
    } else if (this.currentPage === '/dpl') {
      this.fieldConfigure = this.dpl;
      this.title = 'DPL Form';
      this.breadcrumbItems = [
        { label: 'DPL' },
        { label: 'DPL Form', active: true },
      ];
    }
    console.log(
      this.currentPage,
      'Route Snapshot:',
      this.route.snapshot.pathFromRoot
    );

    this.createForm();
  }

  createForm() {
    const group = this.fb.group({});
    this.fieldConfigure.forEach((component: any) => {
      component.mandatory
        ? group.addControl(
            component.formControl,
            new FormControl(
              component.value ? component.value : '',
              Validators.required
            )
          )
        : group.addControl(component.formControl, new FormControl(''));
    });
    this.form = group;
  }
  onSubmit() {
    // this.formGroups.every((group: FormGroup)=>{console.log(group.valid);
    // });
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
      let data = this.form.value;
      let url = 'insertDailyLoan';
      this.commonService.sendData(data, url).subscribe(
        (res: any) => {
          console.log('POST response:', res);
          if (res.status) {
            this.utilService.openSwal('Success', res.message, 'success', 'OK');
            this.router.navigate(['/dailyLoanList']);
          } else {
            this.utilService.openSwal('Error', res.message, 'error', 'OK');
          }
          console.log('POST response:', res);
        },
        (err: any) => {
          this.utilService.openSwal('Error', err.message, 'error', 'OK');
        }
      );
    } else {
      this.form.markAllAsTouched();
      this.snackBar.open('Fill mandatory Fields', 'close', { duration: 2000 });
    }
  }
  onFileChange(event: Event): void {
    console.log('File change event triggered', event);
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.base64Image = reader.result as string;
        this.form.patchValue({ profilePic: this.base64Image });
        this.form.get('profilePic')?.markAsTouched(); // trigger validation
      };

      reader.readAsDataURL(file);
    }
  }

  togglePreview(modal: string): void {
    (this as any)[modal] = !(this as any)[modal];
    if (modal === 'showCaptureModal' && this[modal]) {
      this.initCamera();
    } else if (modal === 'showCaptureModal' && !this[modal]) {
      this.stopCamera();
    }
  }

  initCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.videoStream = stream;
        if (this.video?.nativeElement) {
          this.video.nativeElement.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Camera init error:', err);
      });
  }

  capturePhoto(): void {
    const video = this.video?.nativeElement;
    const canvas = this.canvas?.nativeElement;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.base64Image = canvas.toDataURL('image/png');
      this.form.patchValue({ profilePic: this.base64Image });
      this.form.get('profilePic')?.markAsTouched();
      console.log('Captured Image Base64:', this.base64Image);
      // Optional: send to backend
    }
  }
  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
      this.videoStream = null;
    }
    if (this.video?.nativeElement) {
      this.video.nativeElement.srcObject = null;
    }
  }
  onChange(event: Event, field: any): void {
    if (field.changeLogic && field.changeLogic.length > 0) {
      for (let index = 0; index < field.changeLogic.length; index++) {
        const logic = field.changeLogic[index];
        const calculatedValue = this.calculateValue(logic.details.method,logic.details.fields);
          this.form.patchValue({ [logic.targetField]: calculatedValue });
      }
    }
  }

  calculateValue(method:any, fields: any) {
    const values = fields.map(
      (f: string) => this.form.get(f)?.value || 0
    );
    if (method === 'percentage') {
      return (values[0] * values[1]) / 100;
    } else if (method === 'subtraction') {
      return values[0] - values[1];
    }else if (method === 'addition') {
      return values[0] + values[1];
    }else if (method === 'multiplication') {
      return values[0] * values[1];
    }else if (method === 'division') {
      return values[1] !== 0 ? values[0] / values[1] : 0; // Avoid division by zero
    }
    return 0; // Default case, should not happen
  }
}
