import {  NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChildAExampleComponent } from './pages/child-a-example/child-a-example.component';
import { ChildBExampleComponent } from './pages/child-b-example/child-b-example.component';
import { HomePageComponent } from './pages/home-page-example/home-page.component';
import { LoginPageComponent } from './pages/login-page-example/login-page.component';
import { RegisterExampleComponent } from './pages/register-example/register-example.component';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ParseService } from './services/parse/parse.service';

const routes: Routes = [
  {
    path: 'login', component: LoginPageComponent, children: [
      { path: 'cadastro', component: RegisterExampleComponent, },

    ]
  },
  {
    path: 'home', component: HomePageComponent, canActivate: [AuthenticationService], children: [
      {
        path: 'page-a', component: ChildAExampleComponent
      }, {
        path: 'page-b', component: ChildBExampleComponent
      }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
]


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    ChildAExampleComponent,
    ChildBExampleComponent,
    RegisterExampleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [ParseService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
