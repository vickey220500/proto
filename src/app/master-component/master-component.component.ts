import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-master-component',
  standalone:true,
  templateUrl: './master-component.component.html',
  styleUrl: './master-component.component.scss',
  imports:[MatExpansionModule,CommonModule]
})
export class MasterComponentComponent {
  masterData: any;
  constructor(public http: HttpClient) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getData();
  }
  getData() {
    this.http.get('assets/masterData.json').subscribe((data: any) => {
      this.masterData=data?.rows;
      console.log(this.masterData,'masterData');
      
    });
  }
}
