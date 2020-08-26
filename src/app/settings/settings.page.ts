import { Component, OnInit, Renderer2 } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  profileData: string;
  constructor(
    private _renderer: Renderer2,
    private appVersion: AppVersion
  ) { }

  ngOnInit() {
    this.appVersion.getVersionNumber().then((versionNumber) => {
      this.profileData = versionNumber;
    },(error) => {
        console.log(error);
      }
    );
  }

  onThemeChange(event) {
    if (event.detail.checked) {
      this._renderer.setAttribute(document.body, 'color-theme', 'dark');
    }
    else {
      this._renderer.setAttribute(document.body, 'color-theme', 'light')
    }
  }
}
