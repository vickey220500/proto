import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SidemenuComponent } from "../sidemenu/sidemenu.component";
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
@Component({
	selector: 'app-stepper',
	standalone: true,
	imports: [CommonModule,
		FormsModule,
		ReactiveFormsModule, MatStepperModule, MatButtonModule, MatFormFieldModule, MatInputModule, SidemenuComponent,MatDatepickerModule],
	templateUrl: './stepper.component.html',
	styleUrl: './stepper.component.scss'
})

export class StepperComponent {

	
	stepperMocky : any = {
		type: 'stepper',
		labelPosition: 'bottom',  //bottom/top
		orientation:'vertical', // vertical/horizontal
		isLinear: true,  // if isLinear Each step has mandatory
		steps: [{
			step:1,
			label: 'Personal Details',
			stepButtons: [{type:'next',label:'Next'},{type:'submiy',label:'submit'}],
			uiComponents:[{type:'text',label:'First Name',formControl: 'fname',mandatory:true},{type:'text',label:'Last Name',formControl: 'lname'},{type:'date',label:'DOB',formControl: 'date',mandatory:true},{type:'text',label:'Address',formControl: 'address',mandatory:true}]
		},
		{
		step:2,
		label: 'Bank Details',
		stepButtons: [{type:'previous',label:'Back'},{type:'next',label:'Next'}],
		uiComponents:[{type:'text',label:'Account Holder',formControl: 'accHolder',mandatory:true},{type:'number',label:'Account Number',formControl: 'accNo',mandatory:true},{type:'text',label:'Bank Name',formControl: 'bankName',mandatory:true},{type:'text',label:'Branch Name',formControl: 'branchName',mandatory:true}],
		},
		{
		step:3,
		label: 'Contact Details',
		stepButtons: [{type:'previous',label:'Back'},{type:'next',label:'Next'}],
		uiComponents:[{type:'number',label:'Mobile No',formControl: 'mbNo',mandatory:true},{type:'text',label:'Email',formControl: 'email',mandatory:true}]
		},
		{
			step:4,
			label: 'Contact Details 1',
			stepButtons: [{type:'previous',label:'Back'},{type:'next',label:'Next'}],
			uiComponents:[{type:'number',label:'Mobile No',formControl: 'mbNo',mandatory:true},{type:'text',label:'Email',formControl: 'email',mandatory:true}]
			},
			{
				step:4,
				label: 'Contact Details 2',
				stepButtons: [{type:'previous',label:'Back'},{type:'next',label:'Next'}],
				uiComponents:[{type:'number',label:'Mobile No',formControl: 'mbNo',mandatory:true},{type:'text',label:'Email',formControl: 'email',mandatory:true}]
				},
		{
			step:5,
			label: 'FeedBack',
			stepButtons: [{type:'previous',label:'Back'},{type:'submit',label:'Submit'}],
			uiComponents:[{type:'text',label:'Remarks',formControl: 'remarks'}]
		}
	]
	}
	formGroups: FormGroup[] = [];
	stepIndex: number = 0;

	constructor(private fb : FormBuilder, public snackBar:MatSnackBar){}

	ngOnInit(): void { 
		// this.form = this.fb.group({steps:this.fb.array([])});
		this.createForm();
	}

	createForm() {
			this.stepperMocky.steps.forEach((step: any) => {
				const group = this.fb.group({});
				step.uiComponents.forEach((component: any) => {
					component.mandatory?
					group.addControl(component.formControl, new FormControl('', Validators.required)):group.addControl(component.formControl, new FormControl(''));
				});
				this.formGroups.push(group);
			});
	}
	onSubmit(){
		// this.formGroups.every((group: FormGroup)=>{console.log(group.valid);
		// }); 
		let stepperFormData:any = []
		this.formGroups.forEach((group: FormGroup,index:number)=>{console.log(group.valid,group.value,group);
			!group.valid?this.snackBar.open("Fill mandatory Fields" + index,"close",{duration:2000}): null;
			stepperFormData.push({ [this.stepperMocky.steps[index].label] : group.value})

		}); 
    console.log(stepperFormData,'stepperFormData');
	this.downloadJson(stepperFormData);    
	}
	onNext(index:number) {
		console.log(this.formGroups[index].value, this.formGroups.at(index)?.valid,index); 
		if(this.formGroups.at(index)?.valid)
			{console.log("valid");}
		else {
			this.snackBar.open("Fill mandatory Fields","close",{duration:2000})
		}


		}
		downloadJson(stepperFormData:any){
			var sJson = JSON.stringify(stepperFormData);
			var element = document.createElement('a');
			element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
			element.setAttribute('download', "stepperFormData.json");
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click(); // simulate click
			document.body.removeChild(element);
		}
		
}