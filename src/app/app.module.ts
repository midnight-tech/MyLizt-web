import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ParseService } from './services/parse/parse.service';
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";


const routes: Routes = [
  { path: '' , component: LandingPageComponent, pathMatch:'full'},
  { path: 'login', component: LoginPageComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [ParseService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
