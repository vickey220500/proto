import { Routes } from '@angular/router';
import { StepperComponent } from './stepper/stepper.component';
// import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { MasterComponentComponent } from './master-component/master-component.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { DailyLoanComponent } from './daily-loan/daily-loan.component';
import { DailyLoanListComponent } from './daily-loan-list/daily-loan-list.component';


export const routes: Routes = [
    {path:'',component:SidemenuComponent,
    children:[
        {path:'stepper',component:StepperComponent},
        {path:'master', component:MasterComponentComponent},
        {path:'dailyLoan',component:DailyLoanComponent},
        {path:'dailyLoanList',component:DailyLoanListComponent}
    ]}
];
