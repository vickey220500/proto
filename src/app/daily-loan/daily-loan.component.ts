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
import dlJson from '../../jsons/dlJson.json';
import dplJson from '../../jsons/dplJson.json'
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
  dailyLoan: any =[];
  dpl: any = [];
  fieldConfigure: any = [];
  form!: FormGroup;
  title: string = 'Daily Loan Form';
  breadcrumbItems: any = [];
  base64Image: string | null = null;
  showImageModal: boolean = false;
  showCaptureModal: boolean = false;
  currentPage: any;
  formSubmissionUrl:any

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
    this.currentPage = this.router.url;
    if (this.currentPage === '/dailyLoan') {
      this.fieldConfigure = dlJson;
      this.title = 'Daily Loan Form';
      this.breadcrumbItems = [
        { label: 'Daily Loan' },
        { label: 'Daily Loan Form', active: true },
      ];
      this.formSubmissionUrl='insertDailyLoan';
    } else if (this.currentPage === '/dpl') {
      this.fieldConfigure = dplJson;
      this.title = 'DPL Form';
      this.breadcrumbItems = [
        { label: 'DPL' },
        { label: 'DPL Form', active: true },
      ];
      this.formSubmissionUrl='insertDPLoan';
    }

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
      let url = this.formSubmissionUrl;
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
    }else if (method === 'interest') {
      // values[0]: Principal
      // values[1]: Rate
      // values[2]: Days
      return (values[0] * values[1] * values[2]) / (365 * 100);
    }
    return 0; 
  }
}
