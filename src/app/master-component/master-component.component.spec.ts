import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterComponentComponent } from './master-component.component';

describe('MasterComponentComponent', () => {
  let component: MasterComponentComponent;
  let fixture: ComponentFixture<MasterComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
