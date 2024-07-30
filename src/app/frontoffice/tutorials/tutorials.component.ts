import { Component } from '@angular/core';
import { ArticlesComponent } from '../articles/articles.component';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [ArticlesComponent],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.scss'
})
export class TutorialsComponent {

}
