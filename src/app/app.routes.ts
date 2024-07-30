import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { InformationsComponent } from './frontoffice/informations/informations.component';
import { NewsComponent } from './frontoffice/news/news.component';
import { CodingComponent } from './frontoffice/coding/coding.component';
import { CertificatesComponent } from './frontoffice/certificates/certificates.component';
import { DocumentationComponent } from './frontoffice/documentation/documentation.component';
import { HomeComponent } from './frontoffice/home/home.component';
import { LoginComponent } from './frontoffice/login/login.component';
import { SigninComponent } from './frontoffice/signin/signin.component';
import { LogoutComponent } from './frontoffice/logout/logout.component';
import { ViewArticleComponent } from './frontoffice/view-article/view-article.component';
import { PermissionsService } from './services/permissions.service';
import { ViewCertificateComponent } from './frontoffice/view-certificate/view-certificate.component';
import { TutorialsComponent } from './frontoffice/tutorials/tutorials.component';


export const routes: Routes = [
    { path: './', component: AppComponent },
    { path: 'accueil', component: HomeComponent },
    { path: 'informations', component: InformationsComponent },
    { path: 'news', component: NewsComponent },
    { path: 'coding', component: CodingComponent },
    { path: 'certificates', component: CertificatesComponent},
    { path: 'certificate/:id', component: ViewCertificateComponent },
    { path: 'documentation', component: DocumentationComponent },
    { path: 'tutorials', component: TutorialsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'article-content/:id/:page', component: ViewArticleComponent },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
    export class AppRoutingModule { }  