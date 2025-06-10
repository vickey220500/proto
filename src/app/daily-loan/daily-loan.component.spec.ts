import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLoanComponent } from './daily-loan.component';

describe('DailyLoanComponent', () => {
  let component: DailyLoanComponent;
  let fixture: ComponentFixture<DailyLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
