import { Component, EventEmitter, Output } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
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
    window.addEventListener('resize', () => {
      this.isScreenSmall = window.innerWidth < 768;
    });
  // this.api.username$.subscribe((name) => {
  //     this.username = name;
  //   });
    this.username = localStorage.getItem('username');


  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    const hostElem = document.querySelector('app-root');
    if (hostElem) {
      if (this.isCollapsed) {
        hostElem.classList.add('collapsed');
      } else {
        hostElem.classList.remove('collapsed');
      }
    }
  }

  logout() {

  localStorage.removeItem('username');
  this.router.navigate(['/login']);
  }

}
