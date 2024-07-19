///////////////////////////////////////////////////////
////////////////////  IMPORTATIONS   //////////////////
///////////////////////////////////////////////////////

// Angular modules
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Services
import { ArticleService } from '../../services/article.service';
import { NotificationsService } from '../../services/notifications.service';
import { CertificateService } from '../../services/certificate.service';

// Components
import { TimelineComponent } from '../timeline/timeline.component';
import { PagesComponent } from '../pages/pages.component';
import { NotificationsComponent } from '../notifications/notifications.component';

// Config
import { CONFIG } from '../../../config';
import { log } from 'node:console';


interface QuestionsForm {
  question: Questions,
  choices: Choices[]
}

interface Choices {
  id_choice: number,
  choice_text: string,
  selected: boolean
}


interface Questions {
  id_question: number,
  text: string,
  isMultiple: boolean

}

interface FormResults {
  id_question: number,
  id_choice: number
}

@Component({
  selector: 'app-view-article',
  standalone: true,
  imports: [FormsModule, CommonModule, TimelineComponent, RouterModule, PagesComponent, NotificationsComponent],
  templateUrl: './view-article.component.html',
  styleUrl: './view-article.component.scss'
})

export class ViewArticleComponent implements OnInit {

  formResults: FormResults[] = [];
  // formResults: FormResults[] = [];
  wholeForm: any[] = [];
  htmlForm: QuestionsForm[] = [];

  id_articles: number | undefined = 0;
  note: number = 0;

  // Window Attributes
  isWindowOpen: boolean = true;
  isWindowToggled: boolean = false;


  isFormSubmitted: boolean = false;
  isQuestionsForm: boolean = false;
  // config attribute
  baseUrl = CONFIG.baseUrl;

  // Article Attributes datas
  wholeArticle: any | undefined;
  articleContents: any[] | undefined;

  // Notification Attributes
  isNotificationWindow = false;         // default value for the notification window
  notificationMessage: string = '';     // default value for the notification message

  isCertificate: boolean = false;
  token: string | null = '';

  isLoading: Boolean = false;


  // Constructor build with the services and the router
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private certificateService: CertificateService,
    private notificationServices: NotificationsService

  ) { }

  /**
   * 
   * Method used to fetch article content
   */
  ngOnInit(): void {
    if (this.isFormSubmitted) {
      return;
    }
    
    this.loadArticle();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadArticle();
      }
    });
  }


  /**
   * 
   * Method used to load the article
   * 
   * @returns 
   */
  loadArticle(): void {
  
    // Update the article references
    const page = this.route.snapshot.paramMap.get('page');
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
    this.id_articles = +id;
    }
    // chek if the id or the page is null
    if (!id || !page) {
      console.error('ID or page is null');
      return;

    } else if (id && page === '0') {

      // get the questions form
      this.isLoading = true;
      this.articleService.getQuestions(+id).subscribe({
        next: (data: any) => {
          this.wholeForm = data.body;
          this.htmlForm = this.transformData(this.wholeForm);
          this.isQuestionsForm = true;
          this.isLoading = false;
        },
        error: (error) => {
          const message: string = error.error.message;
           // Display a notification with the error message
           this.notificationServices.displayNotification(this, message, 2000, null, 'server', false);
           this.isLoading = false;
          return;
        }
      });
    } else {

      // get the article by id and page
      this.isLoading = true;
      this.articleService.getArticle(+id, +page).subscribe({
        next: (data: any) => {
          this.wholeArticle = data.body;
          this.articleContents = Object.values(this.wholeArticle);
          this.isLoading = false;
     
        },
        error: (error) => {
          const message: string = error.error.message;
          // Display a notification with the error message
          this.notificationServices.displayNotification(this, message, 2000, null, 'server', false);

          this.isLoading = false;

        }
      });
    }
  }



transformData(data: any[]): QuestionsForm[] {
  return data.map(questionData => {
    const choices: Choices[] = JSON.parse(questionData.choices).map((choice: any) => {
      const [id_choice, choice_text] = Object.entries(choice)[0];
      return {
        id_choice: parseInt(id_choice),
        choice_text: choice_text as string,
        selected: false
      };
    });

    const questionForm: QuestionsForm = {
      question: {
        id_question: questionData.id_questions,
        text: questionData.text,
        isMultiple: questionData.isMultiple
      },
      choices: choices
    };

    return questionForm;
  });
}


  /**
   * 
   * @param event 
   */
  submitForm(event: Event): void {
    event.preventDefault(); // Empêche le rechargement de la page
    this.formResults = []; // Réinitialiser formResults pour la soumission actuelle
    // Itérer sur chaque élément de htmlForm pour accéder à l'état des cases à cocher
    this.htmlForm.forEach((item) => {
      item.choices.forEach((choice) => {
        if (choice.selected) {
          // Créer un objet conforme à l'interface FormResults pour chaque choix sélectionné
          const result: FormResults = {
            id_question: item.question.id_question,
            id_choice: choice.id_choice
          };
          // Ajouter l'objet au tableau des résultats
        this.formResults.push(result);
        }
      });
    });
    this.token = localStorage.getItem('token') || '';

    if (this.id_articles === undefined) {
      return;
    }
    // Envoyer les résultats au serveur
    this.isLoading = true;
    this.articleService.submitResults(this.id_articles, this.formResults, this.token).subscribe({
      next: (data: any) => {

        this.note = data.note;
        this.isLoading = false;

        if (data.note >= 13) {
          this.getNewCertificate(this.wholeArticle[0].id_articles, this.note);
          this.notificationServices.displayNotification(this, 'win-certificate', 3000, '/certificates', 'client', false);
        }
        else {
          this.notificationServices.displayNotification(this, 'loose-certificate', 3000, '/accueil', 'client', false);
        }
       
      },
      error: (error) => {
        const message: string = error.error.message;
        // Display a notification with the error message
  
        this.notificationServices.displayNotification(this, message, 2000, null, 'server', false);

        this.isLoading = false;
      }
    });

  }


  getNewCertificate(id_articles: number, note: number) {
    // switch the certificate state to true
    this.isCertificate = true;

    // get the token from the local storage
    this.token = localStorage.getItem('token');
    if (!this.token || this.token === 'null' || this.token === null || this.token === '') {
      this.notificationServices.displayNotification(this, 'no-token-no-certificate',2000, null, 'client', false);
      return;
    }
    // fetch to the certificate service with parameters
    this.certificateService.createCertificate(id_articles, this.isCertificate, this.note, this.token).subscribe({
      next: (data: any) => {
        // after the response, update the id of the article
        this.id_articles = this.wholeArticle[0].id_articles;

        // // redirect to the certificate page with the id of the article
        // this.router.navigate([`/certificate/${this.id_articles}`]);
      },
      error: (error) => {
        const message: string = error.error.message;
        // Display a notification with the error message
        this.notificationServices.displayNotification(this, message, 2000, null, 'server', false);

      }
    });
  }


  /**
   * 
   * Method used to close the window
   */
  closeWindow() {
    this.isWindowOpen = !this.isWindowOpen;
    this.router.navigate(['/accueil']);
  }

  /**
   * 
   * Method used to toggle the window
   */
  toggleWindow() {
    this.isWindowToggled = !this.isWindowToggled;
  }

  
}