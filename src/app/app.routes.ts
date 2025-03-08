import { Routes } from '@angular/router';
import { StepperComponent } from './stepper/stepper.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';


export const routes: Routes = [
    {path:'',component:SidemenuComponent,
    children:[
        {path:'stepper',component:StepperComponent}
    ]}
];