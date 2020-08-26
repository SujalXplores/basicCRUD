import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user = {} as User;
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

  async login(user: User) {
    if (this.formValidation()) {
      let loader = this._loadingCtrl.create({
        message: "Logging In..."
      });
      (await loader).present();
      try {
        await this._afAuth.signInWithEmailAndPassword(user.email, user.password).then(data => {
          this._navCtrl.navigateRoot("home");
        });
      } catch (e) {
        this.showToast(e);
      }
      (await loader).dismiss();
    }
  }

  formValidation() {
    if (!this.user.email) {
      this.showToast("Please Enter Email");
      return false;
    }
    if (!this.user.password) {
      this.showToast("Please Enter Password");
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
