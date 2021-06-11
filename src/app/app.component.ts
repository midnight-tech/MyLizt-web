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
    appUpdate.available.subscribe((value) => {
      appUpdate.activateUpdate().then(() => {
        document.location.reload();
      })
    })
  }
}
