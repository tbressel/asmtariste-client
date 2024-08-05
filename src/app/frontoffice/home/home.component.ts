import { Component } from '@angular/core';

import { LastCertificatesComponent } from '../last-certificates/last-certificates.component';
import { AverageCertificatesComponent } from '../average-certificates/average-certificates.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LastCertificatesComponent, AverageCertificatesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
