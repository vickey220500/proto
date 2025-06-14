import { Component, EventEmitter, Output } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule,RouterOutlet,MatListModule,MatSidenavModule,MatButtonModule, MatMenuModule ,CommonModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  isScreenSmall = false;
  isCollapsed = false;

  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Output() settingsButtonClicked = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.isScreenSmall = window.innerWidth < 768;
    });
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
    this.router.navigate(['/login']);
  }
}
