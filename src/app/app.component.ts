import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StepperComponent } from "./stepper/stepper.component";
import { ComponentsModule } from './components/components.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ComponentsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'stepper';
}
