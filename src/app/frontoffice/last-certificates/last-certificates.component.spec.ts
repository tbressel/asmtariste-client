import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastCertificatesComponent } from './last-certificates.component';

describe('AllCertificatesComponent', () => {
  let component: LastCertificatesComponent;
  let fixture: ComponentFixture<LastCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastCertificatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LastCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
