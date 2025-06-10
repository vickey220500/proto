import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { MasterComponent } from './master/master.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';


@NgModule({
  declarations: [MasterComponent, SidemenuComponent],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    MatToolbarModule,MatIconModule,RouterOutlet,MatListModule,MatSidenavModule,MatButtonModule
  ],
  exports: [MasterComponent]
})
export class ComponentsModule { }
