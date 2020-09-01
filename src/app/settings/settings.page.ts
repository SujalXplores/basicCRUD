import { Component, OnInit, Renderer2 } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  isVerified: string;
  profileData: string;
  profileEmail: string;
  profileName: string;
  profileImg: string;
  constructor(
    private _renderer: Renderer2,
    private appVersion: AppVersion,
    private _toastCtrl: ToastController,
    private _navCtrl: NavController,
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.getProfile();
    this.checkVerified();
    this.appVersion.getVersionNumber().then((versionNumber) => {
      this.profileData = versionNumber;
    }, (error) => {
      console.log(error);
    });
  }

  onThemeChange(event) {
    if (event.detail.checked) {
      this._renderer.setAttribute(document.body, 'color-theme', 'dark');
    }
    else {
      this._renderer.setAttribute(document.body, 'color-theme', 'light');
    }
  }

  async checkVerified() {
    try {
      this._afAuth.authState.subscribe(data => {
        if (data.emailVerified) {
          this.isVerified = 'Verified';
        }
        else {
          this.isVerified = 'Verify';
        }
      });
    } catch (error) {
      console.log("ERROR");
    }
  }

  async sendEmail() {
    (await this._afAuth.currentUser).sendEmailVerification().then(data => {
      this.showToast("Verification Url has been sent.");
    }).catch(error => {
      this.showToast(error);
    });
  }

  showToast(message: string) {
    this._toastCtrl.create({
      message: message,
      duration: 3000,
      buttons: [
        {
          side: 'start',
          icon: 'information-circle-outline',
        }
      ]
    }).then(toastData => toastData.present());
  }

  async getProfile() {
    var user = this._afAuth.currentUser;
    if (user != null) {
      (await user).providerData.forEach(profile => {
        this.profileEmail = profile.email;
        this.profileName = profile.displayName;
      });
    }
  }

  async onLogout() {
    const alert = await this._alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Logout',
          handler: () => {
            this._afAuth.signOut().then(data => {
              this._navCtrl.navigateRoot("login");
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async onDeleteAccount() {
    const alert = await this._alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure to Delete your account permenently?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
          handler: () => {
            var user = firebase.auth().currentUser;
            user.delete().then(data => {
              this._navCtrl.navigateRoot("login");
            }).catch(error => {
              this.showToast(error);
            })
          }
        }
      ]
    });
    await alert.present();
  }
}
