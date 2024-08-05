import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageCertificatesComponent } from './average-certificates.component';

describe('AverageCertificatesComponent', () => {
  let component: AverageCertificatesComponent;
  let fixture: ComponentFixture<AverageCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageCertificatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AverageCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
