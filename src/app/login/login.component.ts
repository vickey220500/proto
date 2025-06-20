import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatTabsModule,MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  isLogin: boolean = true;

  onTabChange(index: number) {
    this.isLogin = index === 0; 
  }
login() {
    // Implement login logic here
    console.log('Login clicked');
  }
}
