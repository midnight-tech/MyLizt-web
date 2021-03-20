import { NgModule } from '@angular/core';
import { AngularFireModule, FirebaseApp } from '@angular/fire';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChildAExampleComponent } from './pages/child-a-example/child-a-example.component';
import { ChildBExampleComponent } from './pages/child-b-example/child-b-example.component';
import { HomePageComponent } from './pages/home-page-example/home-page.component';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ParseService } from './services/parse/parse.service';
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";
import { SignInComponent } from "./pages/sign-in/sign-in.component";
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { FooterCompanyComponent } from './components/footer-company/footer-company.component';
import { LoggedShieldService } from './services/routes-shield/logged-shield.service';
import { UnloggedShieldService } from './services/routes-shield/unlogged-shield.service';
import { AnimeService } from './services/anime-services/anime.service';



const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full', canActivate: [UnloggedShieldService] },
  { path: 'signin', component: SignInComponent, canActivate: [UnloggedShieldService] },
  { path: 'signup', component: SignUpComponent, canActivate: [UnloggedShieldService] },
  { path: 'verification', component: VerificationComponent, canActivate: [UnloggedShieldService] },
  {
    path: 'home', component: HomePageComponent, canActivate: [LoggedShieldService], children: [
      {
        path: 'page-a', component: ChildAExampleComponent
      }, {
        path: 'page-b', component: ChildBExampleComponent
      }
    ]
  },
  { path: '**', redirectTo: '' }
]


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ChildAExampleComponent,
    ChildBExampleComponent,
    SignInComponent,
    LandingPageComponent,
    SignUpComponent,
    VerificationComponent,
    FooterCompanyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  exports: [RouterModule],
  providers: [ParseService, AuthenticationService, AnimeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
