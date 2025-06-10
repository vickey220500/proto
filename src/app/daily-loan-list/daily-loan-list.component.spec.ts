import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLoanListComponent } from './daily-loan-list.component';

describe('DailyLoanListComponent', () => {
  let component: DailyLoanListComponent;
  let fixture: ComponentFixture<DailyLoanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyLoanListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyLoanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
