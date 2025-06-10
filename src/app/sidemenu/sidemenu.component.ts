import { Component, EventEmitter, Output } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule,RouterOutlet,MatListModule,MatSidenavModule,MatButtonModule,CommonModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {

  mode: string | undefined;
  element: any;
  flagvalue: any;
  cookieValue: any;
  countryName: any;
  valueset: any;

  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(
    private router: Router,) { }

  /***
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  @Output() settingsButtonClicked = new EventEmitter();

  ngOnInit(): void {
    // Cookies wise Language set
    // this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
  }

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    // this.languageService.setLanguage(lang);
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    // if (environment.defaultauth === 'firebase') {
    //   this.authService.logout();
    // } else {
    //   this.authFackservice.logout();
    // }
    this.router.navigate(['/account/login']);
  }
}
