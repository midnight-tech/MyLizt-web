import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AuthenticationService } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MyLizt';

  constructor(appUpdate: SwUpdate, public authenticationService: AuthenticationService) {
    if (!appUpdate.isEnabled) {
      console.info("Not enabled update")
      return;
    }
    appUpdate.checkForUpdate().then(() => {
      appUpdate.available.subscribe((value) => {
        alert("update avaliable")
        appUpdate.activateUpdate().then(() => {
          document.location.reload();
        })
      })
    })
  }
}
