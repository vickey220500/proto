import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-daily-loan',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './daily-loan.component.html',
  styleUrl: './daily-loan.component.scss',
})
export class DailyLoanComponent {
  fieldConfigure: any = [
    {
      type: 'text',
      label: 'First Name',
      formControl: 'fname',
      mandatory: true,
    },
    { type: 'text', label: 'Last Name', formControl: 'lname' },
    { type: 'number', label: 'AGE', formControl: 'age', mandatory: true },
    { type: 'text', label: 'Address', formControl: 'address', mandatory: true },
    {
      type: 'number',
      label: 'Mobile No',
      formControl: 'mbNo',
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
      formControl: 'aadhar',
      mandatory: true,
    },
    { type: 'number', label: 'Pincode', formControl: 'pincode', mandatory: true },
    {
      type: 'image',
      label: 'Upload Image',
      formControl: 'profilePic',
      mandatory: false,
    },
  ];
  form!: FormGroup;
  title: string = 'Daily Loan Form';
  breadcrumbItems = [
    { label: 'Daily Loan' },
    { label: 'Daily Loan Form', active: true },
  ];
  base64Image: string | null = null;

  constructor(public fb: FormBuilder, public snackBar: MatSnackBar) {
    // Initialization logic can go here
  }
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    const group = this.fb.group({});
    this.fieldConfigure.forEach((component: any) => {
      component.mandatory
        ? group.addControl(
            component.formControl,
            new FormControl('', Validators.required)
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
    } else {
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
}
