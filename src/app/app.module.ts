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
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HeaderDetailComponent } from './components/header-detail/header-detail.component';
import { DetailComponent } from './pages/detail/detail.component';
import { AboutDetailComponent } from './components/about-detail/about-detail.component';
import { MyListComponent } from './pages/my-list/my-list.component';
import { CarrouselComponent } from './components/carrousel/carrousel.component';
import { HomeCarrouselComponent } from './pages/home-carrousel/home-carrousel.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { UserService } from './services/user/user.service';
import { RecommendationComponent } from './components/recommendation/recommendation.component';
import { NotificationService } from './services/notification/notification.service';
import { FriendListComponent } from './pages/friend-list/friend-list.component';
import { MyRecommendationsComponent } from './pages/my-recommendations/my-recommendations.component';

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
        component: HomeCarrouselComponent,
      },
      {
        path: 'search',
        component: HomeSearchComponent,
      },
      {
        path: 'detail/:type/:id',
        component: DetailComponent,
      },
      {
        path: 'my-list/:type',
        component: MyListComponent,
      },
      {
        path: 'catalogo/:type',
        component: CatalogoComponent,
      },
      {
        path: 'friends',
        component: FriendsComponent,
      },
      {
        path: 'friend-list/:friendId/:type',
        component: FriendListComponent,
      },
      {
        path: 'recommendations/:type',
        component: MyRecommendationsComponent,
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
    MyListComponent,
    CarrouselComponent,
    HomeCarrouselComponent,
    CatalogoComponent,
    FriendsComponent,
    RecommendationComponent,
    FriendListComponent,
    MyRecommendationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
  ],
  exports: [RouterModule],
  providers: [
    AuthenticationService,
    AnimeService,
    BookService,
    SerieService,
    HomeContextService,
    UserService,
    NotificationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
