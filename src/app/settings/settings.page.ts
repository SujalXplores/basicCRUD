import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private _renderer: Renderer2) { }

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
