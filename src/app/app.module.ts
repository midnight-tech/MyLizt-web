import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { AutoFocusDirectiveDirective } from './directives/autoFocusDirective.directive';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ContentCompletedComponent } from './components/content-completed/content-completed.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LoadingService } from './services/loading/loading.service';
import { CompleteScreenLoadComponent } from './components/completeScreenLoad/completeScreenLoad.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TesteComponent } from './pages/teste/teste.component';
import { PopUpComponent } from './components/pop-up/pop-up.component';
import { EmptyComponent } from './components/empty/empty.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  slidesPerView: 3.5,
  spaceBetween: 30,
  freeMode: true,
  loop: true,
};

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full',
    // canActivate: [UnloggedShieldService],
  },
  {
    path: 'signin',
    component: SignInComponent,
    // canActivate: [UnloggedShieldService],
  },
  {
    path: 'signup',
    component: SignUpComponent,
    // canActivate: [UnloggedShieldService],
  },
  {
    path: 'verification',
    component: VerificationComponent,
    // canActivate: [UnloggedShieldService],
  },
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
        path: 'search/:keySearch/:type/:page',
        component: HomeSearchComponent,
      },
      {
        path: 'detail/:type/:id',
        component: DetailComponent,
      },
      {
        path: 'my-list/:type/:page',
        component: MyListComponent,
      },
      {
        path: 'catalogo/:type/:page',
        component: CatalogoComponent,
      },
      {
        path: 'friends/:page',
        component: FriendsComponent,
      },
      {
        path: 'friend-list/:friendId/:type/:page',
        component: FriendListComponent,
      },
      {
        path: 'recommendations/:type/:page',
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
    SignInComponent,
    LandingPageComponent,
    SignUpComponent,
    VerificationComponent,
    FooterCompanyComponent,
    HomeComponent,
    MenuLeftComponent,
    TopBarComponent,
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
    AutoFocusDirectiveDirective,
    ContentCompletedComponent,
    CompleteScreenLoadComponent,
    TesteComponent,
    PopUpComponent,
    EmptyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    NgxMaskModule.forRoot(maskConfigFunction),
    NgxSkeletonLoaderModule.forRoot(),
    SwiperModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
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
    LoadingService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
