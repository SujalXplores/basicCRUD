import { Component, OnInit, Renderer2 } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  profileData: any;
  constructor(
    private _renderer: Renderer2,
    private afAuth: AngularFireAuth,
    private afData: AngularFireDatabase,
  ) { 

  }

  ngOnInit() {
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
