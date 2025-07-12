import { Component, EventEmitter, Output } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import { commonService } from '../services/common.service';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule,RouterOutlet,MatListModule,MatSidenavModule,MatButtonModule, MatMenuModule ,CommonModule,RouterModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  isScreenSmall = false;
  isCollapsed = false;

  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Output() settingsButtonClicked = new EventEmitter();

  constructor(private router: Router,private api: commonService) {}
username: string | null = null;
  ngOnInit(): void {

  // this.checkScreen();
  // window.addEventListener('resize', () => this.checkScreen());
  // this.api.username$.subscribe((name) => {
  //     this.username = name;
  //   });
    this.username = localStorage.getItem('username');


  }

 toggleMenu(snav: MatSidenav) {
  if (this.isScreenSmall) {
    snav.toggle(); // normal toggle on small screens
  } else {
    this.isCollapsed = !this.isCollapsed; // collapse/expand on large screens
  }
}

// checkScreen() {
//   this.isScreenSmall = window.innerWidth < 768;
//   if (this.isScreenSmall) {
//     this.isCollapsed = false; // always expanded in overlay
//   }
// }

  logout() {

  localStorage.removeItem('username');
  this.router.navigate(['/login']);
  }

}
