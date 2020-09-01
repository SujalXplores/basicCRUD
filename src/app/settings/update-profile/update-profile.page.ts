import { Component, OnInit } from '@angular/core';
import { Profile } from "../../models/profile.model";
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {

  profile = {} as Profile;
  passwordIcon: string = 'eye-off-outline';
  showPassword: boolean = false;
  constructor(
    private _toastCtrl: ToastController,
    private _loadingCtrl: LoadingController,
    private _afAuth: AngularFireAuth,
    private _navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  async updateUser(profile: Profile) {
    if (this.formValidation()) {
      let loader = this._loadingCtrl.create({
        message: "Updating Profile..."
      });
      (await loader).present();
      try {
        var user = this._afAuth.currentUser;
        (await user).updateProfile({
          displayName: profile.displayName,
          photoURL: profile.photoURL,
        }).then(() => {
          this.showToast("Profile Updated.");
          this._navCtrl.back();
        }).catch((error) => {
          this.showToast(error);
        });
      } catch (e) {
        this.showToast(e);
      }
      (await loader).dismiss();
    }
  }

  formValidation() {
    if (!this.profile.displayName) {
      this.showToast("Please Enter Name");
      return false;
    }
    if (!this.profile.photoURL) {
      this.showToast("Please choose photo");
      return false;
    }
    return true;
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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    if (this.passwordIcon == 'eye-outline') {
      this.passwordIcon = 'eye-off-outline';
    }
    else {
      this.passwordIcon = 'eye-outline';
    }
  }
}
