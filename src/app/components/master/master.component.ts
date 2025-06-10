import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-master',
  // standalone: true,
  // imports: [],
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss'
})
export class MasterComponent {
formGroups: FormGroup[] = [];
  stepIndex: number = 0;

  constructor(private fb : FormBuilder, public snackBar:MatSnackBar){}

  ngOnInit(): void { 
    // this.form = this.fb.group({steps:this.fb.array([])});
    this.createForm();
  }

  createForm() {
      // this.stepperMocky.steps.forEach((step: any) => {
      //   const group = this.fb.group({});
      //   step.uiComponents.forEach((component: any) => {
      //     component.mandatory?
      //     group.addControl(component.formControl, new FormControl('', Validators.required)):group.addControl(component.formControl, new FormControl(''));
      //   });
      //   this.formGroups.push(group);
      // });
  }
  
}
