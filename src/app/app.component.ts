import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MyLizt';

  constructor(appUpdate: SwUpdate) {
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
