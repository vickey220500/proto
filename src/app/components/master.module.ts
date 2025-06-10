import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,    
    MatToolbarModule,MatIconModule,RouterOutlet,MatListModule,MatSidenavModule,MatButtonModule
  ]
})
export class MasterModule { }
