import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChildAExampleComponent } from './pages/child-a-example/child-a-example.component';
import { HomePageComponent } from './pages/home-page-example/home-page.component';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ParseService } from './services/parse/parse.service';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { FooterCompanyComponent } from './components/footer-company/footer-company.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuLeftComponent } from './components/menu-left/menu-left.component';
import { LoggedShieldService } from './services/routes-shield/logged-shield.service';
import { UnloggedShieldService } from './services/routes-shield/unlogged-shield.service';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { AnimeService } from './services/anime/anime.service';
import { SandboxPageComponent } from './pages/sandbox-page/sandbox-page.component';
import { BookService } from './services/book/book.service';
import { SerieService } from './services/serie/serie.service';
import { HomeContextService } from './services/home-context/home.service';
import { HomeSearchComponent } from './pages/home-search/home-search.component';
import { CardComponent } from './components/card/card.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { HeaderDetailComponent } from './components/header-detail/header-detail.component';
import { DetailComponent } from './pages/detail/detail.component';
import { AboutDetailComponent } from './components/about-detail/about-detail.component';

const routes: Routes = [
  { path: 'sandbox', component: SandboxPageComponent, pathMatch: 'full' },
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full',
    canActivate: [UnloggedShieldService],
  },
  {
    path: 'signin',
    component: SignInComponent,
    canActivate: [UnloggedShieldService],
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [UnloggedShieldService],
  },
  {
    path: 'verification',
    component: VerificationComponent,
    canActivate: [UnloggedShieldService],
  },
  {
    path: 'home2',
    component: HomeComponent,
    canActivate: [UnloggedShieldService],
  }, //teste
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [LoggedShieldService],
    children: [
      {
        path: '',
        component: ChildAExampleComponent,
      },
      {
        path: 'search',
        component: HomeSearchComponent,
      },
      {
        path: 'detail',
        component: DetailComponent,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ChildAExampleComponent,
    SignInComponent,
    LandingPageComponent,
    SignUpComponent,
    VerificationComponent,
    FooterCompanyComponent,
    HomeComponent,
    MenuLeftComponent,
    TopBarComponent,
    SandboxPageComponent,
    HomeSearchComponent,
    CardComponent,
    PaginationComponent,
    HeaderDetailComponent,
    DetailComponent,
    AboutDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  exports: [RouterModule],
  providers: [
    ParseService,
    AuthenticationService,
    AnimeService,
    BookService,
    SerieService,
    HomeContextService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
