import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {  Router } from '@angular/router';
import { commonService } from '../services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatTabsModule,MatIconModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

loginForm: FormGroup;
registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  
  constructor(private api: commonService,private fb: FormBuilder,private router: Router) 
  {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      aadharNo: ['', Validators.required],
      pancard: ['', Validators.required],
      pincode: ['', Validators.required], 
      address: ['', Validators.required]    
    })
  }



  isLogin: boolean = true;

  onTabChange(index: number) {
    this.isLogin = index === 0; 
  }

  // onSubmit(): void {
   
  //   if (this.loginForm.invalid) return;

  //   this.loading = true;
  //   const { userId, password } = this.loginForm.value;
  //   console.log('val', this.loginForm.value);

  //   this.api.login(userId, password).subscribe({
  //     next: (response) => {
  //       this.loading = false;
  //       console.log('Login successful', response);
  //       this.router.navigate(['/dashboard']);
  //     },
  //     error: (error) => {
  //       this.loading = false;
  //       this.errorMessage = 'Invalid userid or password';
  //       console.error('Login error:', error);
  //     },
  //   });
  // }

  // onSubmit(): void {
  // if (this.loginForm.invalid) return;

  // this.loading = true;
  // const { userId, password } = this.loginForm.value;

  // this.api.login(userId, password).subscribe({
  //   next: (response) => {
  //     this.loading = false;

  //     console.log('Login successful', response);
  //     const username = response?.user.userName || 'User'; 

  //     this.api.setUsername(username);
  //     this.router.navigate(['/dashboard']);
  //   },
  //   error: (error) => {
  //     this.loading = false;
  //     this.errorMessage = 'Invalid userid or password';
  //     console.error('Login error:', error);
  //   },
  // })}

  onSubmit(): void {
  if (this.loginForm.invalid) return;

  this.loading = true;
  const { userId, password } = this.loginForm.value;

  this.api.login(userId, password).subscribe({
    next: (response) => {
      this.loading = false;

      console.log('Login successful', response);
      const username = response?.user.userName || 'User';

    
      localStorage.setItem('username', username);

     
      this.api.setUsername(username);

      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      this.loading = false;
      this.errorMessage = 'Invalid userid or password';
      console.error('Login error:', error);
    },
  });
}

  
  onRegister(): void {
   
    if (this.registerForm.invalid) return;

    this.loading = true;
    const { userName,
      email,
      password,
      phoneNumber,
      aadharNo,
      pancard,
      pincode,
      address,role } = this.registerForm.value;
    console.log('val', this.registerForm.value);

    this.api.register( userName,
      email,
      password,
      phoneNumber,
      aadharNo,
      pancard,
      pincode,
      address,role).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Register successful', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Register failed';
        console.error('Login error:', error);
      },
    });
  }

}
