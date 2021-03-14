import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ParseService } from './services/parse/parse.service';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent},
  { path: '' , redirectTo: '/login', pathMatch:'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent
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
